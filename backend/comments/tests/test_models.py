from django.core.exceptions import ValidationError
from django.test import TestCase
from comments.models import Comment
from comments.tests.helpers.test_helpers import TestHelpers


class CommentModelTest(TestCase, TestHelpers):

    def test_create_valid_comment(self):
        """ Test that a comment is created with valid data """
        comment = self.create_comment(
            username="User",
            email="user@example.com",
            text="<p>Valid content</p>"
        )
        self.assertIsNotNone(comment.id)

    def test_create_comment_without_username(self):
        """ Test that creating a comment without a username """
        comment = Comment(email="user@example.com", text="Some content")

        with self.assertRaises(ValidationError) as context:
            comment.full_clean()

        self.assertIn('username', context.exception.message_dict)
        self.assertEqual(context.exception.message_dict['username'], ['This field cannot be blank.'])

    def test_create_comment_with_invalid_email(self):
        """ Test that creating a comment with an invalid email """
        comment = Comment(username="User", email="invalid-email", text="Some content")

        with self.assertRaises(ValidationError) as context:
            comment.full_clean()

        self.assertIn('email', context.exception.message_dict)
        self.assertEqual(context.exception.message_dict['email'], ['Enter a valid email address.'])

    def test_clean_method_with_descendant(self):
        """ Test that the clean method raises a validation error if a comment is a descendant of itself """
        parent_comment = self.create_comment(
            username="Parent",
            email="parent@example.com",
            text="Parent comment"
        )
        child_comment = self.create_comment(
            username="Child",
            email="child@example.com",
            text="Child comment",
            parent=parent_comment
        )
        # Trying to set parent as child to create a descendant loop
        parent_comment.parent = child_comment
        with self.assertRaises(ValidationError):
            parent_comment.clean()

    def test_is_descendant(self):
        """ Test that _is_descendant correctly identifies descendants """
        parent_comment = self.create_comment(
            username="Parent",
            email="parent@example.com",
            text="Parent comment"
        )
        child_comment = self.create_comment(
            username="Child",
            email="child@example.com",
            text="Child comment",
            parent=parent_comment
        )
        grandchild_comment = self.create_comment(
            username="Grandchild",
            email="grandchild@example.com",
            text="Grandchild comment",
            parent=child_comment
        )

        self.assertTrue(parent_comment._is_descendant(grandchild_comment))
        self.assertFalse(grandchild_comment._is_descendant(parent_comment))

    def test_save_method_bleach(self):
        """ Test that the save method sanitizes the text using bleach """

        # Unclosed tag should be automatically closed
        unclosed_tag_comment = self.create_comment(
            username="User",
            email="user@example.com",
            text="<p><strong>Unclosed tag"
        )
        unclosed_tag_comment.save()
        self.assertIn("<p><strong>Unclosed tag</strong></p>", unclosed_tag_comment.text)

        # Tags and attributes should be sanitized according to ALLOWED_TAGS and ALLOWED_ATTRIBUTES
        allowed_tags_comment = self.create_comment(
            username="User",
            email="user@example.com",
            text=('<p>Hello <a href="https://example.com" title="link">click here</a>!</p>'
                  '<img src="image.jpg" alt="image" width="100" height="200" class="responsive" />'
                  '<em>emphasized</em><strong>strong</strong>'
                  '<script>alert("XSS")</script>')  # <script> tag is not allowed
        )
        allowed_tags_comment.save()

        # Check that only allowed tags are kept
        self.assertIn(
            '<p>Hello <a href="https://example.com" title="link">click here</a>!</p>', allowed_tags_comment.text)
        self.assertIn(
            '<img src="image.jpg" alt="image" width="100" height="200" class="responsive">', allowed_tags_comment.text)
        self.assertIn('<em>emphasized</em>', allowed_tags_comment.text)
        self.assertIn('<strong>strong</strong>', allowed_tags_comment.text)

        # Ensure the <script> tag content is escaped, not executed
        self.assertNotIn('<script>', allowed_tags_comment.text)
        self.assertIn('&lt;script&gt;alert("XSS")&lt;/script&gt;', allowed_tags_comment.text)

        # Attributes not in ALLOWED_ATTRIBUTES should be removed
        invalid_attributes_comment = self.create_comment(
            username="User",
            email="user@example.com",
            text=('<a href="https://example.com" onclick="alert(\'XSS\')" title="link">click here</a>'
                  '<img src="image.jpg" alt="image" style="border: 1px solid red;" width="100" height="200">')
        )
        invalid_attributes_comment.save()

        # Ensure invalid 'onclick' and 'style' attributes are removed
        self.assertNotIn('onclick', invalid_attributes_comment.text)
        self.assertNotIn('style', invalid_attributes_comment.text)

        # Check that valid attributes are preserved
        self.assertIn('<a href="https://example.com" title="link">click here</a>', invalid_attributes_comment.text)
        self.assertIn('<img src="image.jpg" alt="image" width="100" height="200">', invalid_attributes_comment.text)
