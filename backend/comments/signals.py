from django.core.cache import cache
from django.db.models.signals import post_save
from django.dispatch import receiver

from comments.models import Comment
from core.behaviors import post_delete_soft


@receiver(post_save, sender=Comment)
@receiver(post_delete_soft, sender=Comment)
def clear_cache_on_change(sender, instance, **kwargs):
    cache_key = 'comments_list'
    cache.delete(cache_key)
