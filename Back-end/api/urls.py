from django.urls import path
from . import views

urlpatterns = [
    path('department/',views.department,name = 'department'),
    path('issues/',views.issues,name='issues'),
    ]
