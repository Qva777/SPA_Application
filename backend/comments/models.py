import bleach
from django.db import models
from django.utils.html import strip_tags
from tinymce.models import HTMLField

from comments.validators import validate_not_descendant
from config.settings import ALLOWED_TAGS, ALLOWED_ATTRIBUTES
from core.behaviors import Timestampable, SoftDeletionModel


class Comment(Timestampable, SoftDeletionModel):
    username = models.CharField(verbose_name="User Name", max_length=150)
    email = models.EmailField(verbose_name='Email', max_length=64, blank=False)
    homepage = models.URLField(verbose_name="Home page", blank=True, null=True)
    text = HTMLField(verbose_name="Content")

    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        related_name='replies',
        on_delete=models.CASCADE,
        verbose_name="Parent comment"
    )

    class Meta:
        verbose_name = "Comment"
        verbose_name_plural = "Comments"
        ordering = ['created_at']

    def __str__(self):
        clean_text = strip_tags(self.text)
        return f"{self.username} - {clean_text[:20]}..."

    def clean(self):
        """ Checking for descendant """
        super().clean()
        if self.parent:
            validate_not_descendant(self, self.parent)

    def _is_descendant(self, comment):
        """ Checking if a given comment is a child of a specified comment """
        while comment.parent:
            if comment.parent == self:
                return True
            comment = comment.parent
        return False

    def save(self, *args, **kwargs):
        """ Clean up comments  with bleach """
        if self.text:
            self.text = bleach.clean(self.text, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRIBUTES, strip=False)
        super().save(*args, **kwargs)
