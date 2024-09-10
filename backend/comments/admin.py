from django.contrib import admin
from comments.models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """ Comments displayed fields on admin page """
    list_display = ('pk', 'username', 'email', 'parent')
    list_display_links = ('pk', 'username',)
    search_fields = ('username', 'email')
    save_on_top = True
    list_per_page = 25
