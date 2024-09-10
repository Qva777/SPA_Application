from django.test import TestCase
from comments.models import Comment
from comments.tests.helpers.test_helpers import TestHelpers


class SoftDeletionModelTest(TestCase):

    def setUp(self):
        """ Create test data using TestHelpers """
        self.test_obj = TestHelpers.create_comment(username="User", email="user@example.com", text="<p>Content</p>")

    def test_create(self):
        """ Check that the object is created """
        self.assertIsNotNone(self.test_obj.id)
        self.assertIsNone(self.test_obj.deleted_at)

    def test_soft_delete(self):
        """ Check that the object can be soft-deleted """
        self.test_obj.delete()

        self.test_obj.refresh_from_db()
        self.assertIsNotNone(self.test_obj.deleted_at)
        self.assertEqual(Comment.objects.count(), 0)
        self.assertEqual(Comment.all_objects.count(), 1)

    def test_recover(self):
        """ Check that the object can be recovered after soft-deletion """
        self.test_obj.delete()
        self.test_obj.recover()

        self.test_obj.refresh_from_db()
        self.assertIsNone(self.test_obj.deleted_at)
        self.assertEqual(Comment.objects.count(), 1)
        self.assertEqual(Comment.all_objects.count(), 1)

    def test_hard_delete(self):
        """ Check that the object can be hard-deleted """
        self.test_obj.delete()
        self.test_obj.hard_delete()
        with self.assertRaises(Comment.DoesNotExist):
            Comment.objects.get(id=self.test_obj.id)

    def test_queryset(self):
        """ Check that queryset filtering works as expected """
        self.test_obj.delete()
        self.assertEqual(Comment.objects.count(), 0)
        self.assertEqual(Comment.all_objects.count(), 1)

    def test_hard_delete_all(self):
        """ Check that all objects can be hard-deleted """
        self.test_obj2 = TestHelpers.create_comment(username="User", email="user@example.com", text="<p>Content</p>")
        self.test_obj.delete()
        self.test_obj2.delete()
        Comment.all_objects.hard_delete()
        self.assertEqual(Comment.objects.count(), 0)
