from django.contrib.auth import get_user_model
from comments.models import Comment

User = get_user_model()


class TestHelpers:

    @staticmethod
    def create_user(username, email, password):
        """ Create and return a test user """
        return User.objects.create_user(username=username, email=email, password=password)

    @staticmethod
    def create_comment(username, email, text, parent=None):
        """ Create and return a test comment """
        return Comment.objects.create(username=username, email=email, text=text, parent=parent)

    @staticmethod
    def check_serializer_fields(serializer, expected_fields):
        """ Check that the serializer fields match the expected fields """
        data = serializer.data
        assert set(data.keys()) == set(expected_fields)
        return data
