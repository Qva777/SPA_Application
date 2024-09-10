from rest_framework import serializers
from comments.models import Comment
from django.shortcuts import get_object_or_404
from comments.validators import validate_not_descendant


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'username', 'email', 'homepage', 'text', 'created_at', 'parent']


class CommentDetailSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'username', 'email', 'homepage', 'text', 'created_at', 'parent', 'replies']

    def validate(self, data):
        """ Ensure that a comment is not a descendant of itself """
        parent = data.get('parent')
        if parent:
            parent_comment = get_object_or_404(Comment, id=parent.id)
            validate_not_descendant(parent_comment, parent_comment)
        return data

    def get_replies(self, obj):
        return self.paginate_comments(obj.replies.all().order_by('-created_at'))

    def paginate_comments(self, comments):
        serialized_comments = []
        for comment in comments:
            serialized_comment = CommentSerializer(comment).data
            serialized_comment['replies'] = []
            serialized_comment['replies'] = self.paginate_comments(comment.replies.all().order_by('-created_at'))
            serialized_comments.append(serialized_comment)
        return serialized_comments
