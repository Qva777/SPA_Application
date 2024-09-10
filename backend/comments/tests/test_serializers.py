from django.test import TestCase
from comments.serializers import CommentSerializer, CommentDetailSerializer
from comments.tests.helpers.test_helpers import TestHelpers


class CommentSerializerTest(TestCase, TestHelpers):

    def setUp(self):
        self.comment = self.create_comment(
            username="User",
            email="user@example.com",
            text="Some content"
        )
        self.serializer = CommentSerializer(instance=self.comment)

    def test_comment_serializer_fields(self):
        """ Test that the serializer fields are correctly serialized """
        expected_fields = {'id', 'username', 'email', 'homepage', 'text', 'created_at', 'parent'}
        data = self.check_serializer_fields(self.serializer, expected_fields)
        self.assertEqual(data['username'], self.comment.username)
        self.assertEqual(data['email'], self.comment.email)
        self.assertEqual(data['text'], self.comment.text)
        self.assertIsNone(data['homepage'])
        self.assertIsNone(data['parent'])


class CommentDetailSerializerTest(TestCase, TestHelpers):

    def setUp(self):
        self.parent_comment = self.create_comment(
            username="ParentUser",
            email="parent@example.com",
            text="Parent content"
        )
        self.child_comments = [
            self.create_comment(
                username=f"ChildUser{i}",
                email=f"child{i}@example.com",
                text=f"Child content {i}",
                parent=self.parent_comment
            ) for i in reversed(range(8))
        ]
        self.serializer = CommentDetailSerializer(instance=self.parent_comment)

    def test_get_replies(self):
        """ Test that replies are correctly serialized """
        data = self.serializer.data

        self.assertIn('replies', data)
        self.assertIsInstance(data['replies'], list)

        def check_replies(replies):
            for reply in replies:
                self.assertIsInstance(reply, dict)
                self.assertIn('username', reply)
                self.assertIn('email', reply)
                self.assertIn('text', reply)
                self.assertIn('parent', reply)
                if 'replies' in reply:
                    self.assertIsInstance(reply['replies'], list)
                    check_replies(reply['replies'])
        check_replies(data['replies'])
