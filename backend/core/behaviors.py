import uuid
from django.db import models
from django.db.models import QuerySet
from django.db.models.signals import Signal
from django.utils import timezone

post_delete_soft = Signal()


class Timestampable(models.Model):
    """ Abstract model adds fields to the inheriting model """
    id = models.UUIDField(
        auto_created=True,
        primary_key=True,
        editable=False,
        default=uuid.uuid4,
        verbose_name="ID",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SoftDeletionQuerySet(QuerySet):
    """ Custom QuerySet for soft deletion, includes methods for filtering alive and dead records """

    def delete(self):
        post_delete_soft.send(sender=self.model, instance=self)
        return super(SoftDeletionQuerySet, self).update(deleted_at=timezone.now())

    def hard_delete(self):
        return super(SoftDeletionQuerySet, self).delete()

    def alive(self):
        return self.filter(deleted_at=None)

    def dead(self):
        return self.exclude(deleted_at=None)


class SoftDeletionManager(models.Manager):
    """ Custom Manager for handling soft deletion, controlling whether alive_only objects are shown """

    def __init__(self, *args, **kwargs):
        self.alive_only = kwargs.pop("alive_only", True)
        super(SoftDeletionManager, self).__init__(*args, **kwargs)

    def get_queryset(self):
        if self.alive_only:
            return SoftDeletionQuerySet(self.model).filter(deleted_at=None)
        return SoftDeletionQuerySet(self.model)

    def hard_delete(self):
        return self.get_queryset().hard_delete()


class SoftDeletionModel(models.Model):
    """ Abstract model that adds soft deletion support by tracking a 'deleted_at' timestamp """
    deleted_at = models.DateTimeField(blank=True, null=True)

    objects = SoftDeletionManager()
    all_objects = SoftDeletionManager(alive_only=False)

    class Meta:
        abstract = True

    def delete(self):
        self.deleted_at = timezone.now()
        self.save()

    def recover(self):
        self.deleted_at = None
        self.save()

    def hard_delete(self):
        super(SoftDeletionModel, self).delete()
