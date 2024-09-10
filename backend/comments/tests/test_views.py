from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from comments.models import Comment
from comments.serializers import CommentSerializer, CommentDetailSerializer
from comments.tests.helpers.test_helpers import TestHelpers

User = get_user_model()


class HomeViewTest(TestCase):

    def test_home_view_context(self):
        """ Test that frontend_url is included in context """
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertIn('frontend_url', response.context)


class CommentAPITestCase(APITestCase, TestHelpers):

    @classmethod
    def setUpClass(cls):
        """ Create test data and obtain a token """
        super().setUpClass()
        cls.user = cls.create_user(username='testuser', email='testuser@example.com', password='testpassword')
        cls.comment = cls.create_comment(username='testuser', email='testuser@example.com', text='Test comment')

        # Obtain a token for the user
        refresh = RefreshToken.for_user(cls.user)
        cls.access_token = str(refresh.access_token)

    def setUp(self):
        """ Set up authorization header """
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)

    def test_comment_create(self):
        """ Test creating a comment """
        url = reverse('comment_create')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'text': 'New comment',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Ensure the comment was created
        new_comment = Comment.objects.get(username='newuser')
        self.assertEqual(new_comment.email, 'newuser@example.com')
        self.assertEqual(new_comment.text, 'New comment')

    def test_comment_detail(self):
        """ Test retrieving comment details """
        url = reverse('comment_detail', args=[self.comment.pk])
        response = self.client.get(url)
        serializer = CommentDetailSerializer(self.comment)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_comment_update(self):
        """ Test updating a comment """
        url = reverse('comment_detail', args=[self.comment.pk])
        data = {
            'username': 'updateduser',
            'email': 'updateduser@example.com',
            'text': 'Updated comment',
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.comment.refresh_from_db()
        self.assertEqual(self.comment.username, 'updateduser')
        self.assertEqual(self.comment.text, 'Updated comment')

    def test_comment_partial_update(self):
        """ Test partially updating a comment """
        url = reverse('comment_detail', args=[self.comment.pk])
        data = {
            'text': 'Partially updated comment',
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.comment.refresh_from_db()
        self.assertEqual(self.comment.text, 'Partially updated comment')

    def test_comment_delete(self):
        """ Test deleting a comment """
        url = reverse('comment_detail', args=[self.comment.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Comment.objects.count(), 0)

    def test_comments_list(self):
        """ Test retrieving the list of comments """
        url = reverse('comments_list')
        response = self.client.get(url)
        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], serializer.data)
