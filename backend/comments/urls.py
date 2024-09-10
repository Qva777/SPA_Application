from django.urls import path
from comments import views

urlpatterns = [
    # CRUD comments
    path('comments_create/', views.CommentCreateAPIView.as_view(), name='comment_create'),
    path('comment/<uuid:pk>/', views.CommentDetailAPIView.as_view(), name='comment_detail'),
    path('comments_list/', views.CommentsListAPIView.as_view(), name='comments_list'),
]
