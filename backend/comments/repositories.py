from comments.models import Comment


class CommentRepository:
    @staticmethod
    def get_all_comments():
        """ Get all Comment objects """
        return Comment.objects.all()

    @staticmethod
    def get_comment_list():
        """ Get list of parent comment (LIFO) """
        return Comment.objects.filter(parent__isnull=True).order_by('-created_at')
