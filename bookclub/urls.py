"""bookclub URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('sign_up/', views.SignUpView.as_view(), name='sign_up'),
    path('log_in/', views.LogInView.as_view(), name='log_in'),
    path('log_out/', views.log_out, name='log_out'),
    path('dummy/', views.dummy, name='dummy'),
    path('create_club/', views.create_club, name='create_club'),
    path('club_list/', views.club_list, name='club_list'),
    path('user_club_list/', views.user_club_list, name='user_club_list'),
    path('apply_club/<int:club_id>', views.apply_club, name='apply_club'),
    path('accept_applicant/<int:club_id>/<int:applicant_id>', views.accept_applicant, name='accept_applicant'),
    path('reject_applicant/<int:club_id>/<int:applicant_id>', views.reject_applicant, name='reject_applicant'),
    path('ban_member/<int:club_id>/<int:member_id>', views.ban_member, name='ban_member'),
    path('transfer_ownership/<int:club_id>/<int:new_owner_id>', views.transfer_ownership, name='transfer_ownership'),
]
