import os
from django.core.cache import cache
from rest_framework import generics, permissions
from django.views.generic import TemplateView

from comments.pagination import CustomPageNumberPagination
from comments.repositories import CommentRepository
from comments.serializers import CommentSerializer, CommentDetailSerializer
from config.settings import CACHE_TIMEOUT


class HomeView(TemplateView):
    """ Backend home page """
    template_name = "home/index.html"

    def get_context_data(self, **kwargs):
        frontend_url = os.environ.get("FRONTEND_URL")
        context = super().get_context_data(**kwargs)
        context['frontend_url'] = frontend_url
        return context


class CommentsListAPIView(generics.ListAPIView):
    """ List all comments with cache """
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CustomPageNumberPagination
    serializer_class = CommentSerializer

    def get_queryset(self):
        cache_key = 'comments_list'
        cached_data = cache.get(cache_key)
        if cached_data:
            return cached_data

        queryset = CommentRepository.get_comment_list()
        cache.set(cache_key, queryset, timeout=CACHE_TIMEOUT)
        return queryset


class CommentCreateAPIView(generics.CreateAPIView):
    """ Create a new comment """
    permission_classes = [permissions.IsAuthenticated]
    queryset = CommentRepository.get_all_comments()
    serializer_class = CommentSerializer


class CommentDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """ Retrieve, update or delete comment """
    permission_classes = [permissions.IsAuthenticated]
    queryset = CommentRepository.get_all_comments()
    serializer_class = CommentDetailSerializer

    def get(self, request, *args, **kwargs):
        """ Get comment by id """
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """ Update comment by id """
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        """ Partial update comment by id """
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """ Delete comment by id """
        return self.destroy(request, *args, **kwargs)
