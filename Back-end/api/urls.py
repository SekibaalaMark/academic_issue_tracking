from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet,IssueViewSet,UserViewSet,Registration


router = DefaultRouter()
router.register(r'departments',DepartmentViewSet)
router.register(r'issues',IssueViewSet)
router.register(r'users',UserViewSet)

#urls

urlpatterns = [
    path('',include(router.urls)),
    path('register/',Registration.as_view(),name = "register"),
]


