from django.urls import path
from .views.authentication_views import BlacklistTokenView, GetCurrentUserView
from .views.static_views import HelloWorldView
from .views.account_views import CreateUser
from .views.authentication_views import BlacklistTokenView
from .views.chat_views import (
    ChatListView,
    ChatDetailView,
    ChatCreateView,
    ChatUpdateView,
    ChatDeleteView
)

app_name = 'app'

# add api urls here

urlpatterns = [
    path('user/sign_up/', CreateUser.as_view(), name="create_user"),
    path('user/log_out/blacklist/', BlacklistTokenView.as_view(), name='blacklist'),
    path('get_current_user/', GetCurrentUserView.as_view(), name='current_user'),
    path('hello/', HelloWorldView.as_view(), name='hello_world'),
    path('chat/', ChatListView.as_view()),
    path('chat/create/', ChatCreateView.as_view()),
    path('chat/<pk>', ChatDetailView.as_view()),
    path('chat/<pk>/update/', ChatUpdateView.as_view()),
    path('chat/goo<pk>/delete/', ChatDeleteView.as_view()),
]
