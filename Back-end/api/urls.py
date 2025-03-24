from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView


router = DefaultRouter()
router.register(r'departments',DepartmentViewSet)
router.register(r'issues',IssueViewSet)
router.register(r'users',UserViewSet)
router.register(r'assignissues',IssueAssignViewSet,basename='assign-issues')

#urls

urlpatterns = [
    path('',include(router.urls)),
    path("login/",login,name="login"),
    path('logout/',logout,name="logout"),
    path('filter_issues',filter_issues,name="filter_issues"),
    path('register/student/',StudentRegistrationView.as_view(),name = "register_studentr"),
    path('register/lecturer/',LecturerRegistrationView.as_view(),name = "register_lecturer"),
    path('register/registrar/',RegistrarRegistrationView.as_view(),name = "register_registrar"),
    path("token/",TokenObtainPairView.as_view(),name="get_token"),
    path('token/refresh',TokenRefreshView.as_view(),name="refresh_token"),
    path("auth/",include("rest_framework.urls")),
]


