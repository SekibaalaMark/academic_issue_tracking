from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet,IssueViewSet,UserViewSet,Registration,filter_issues
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView


router = DefaultRouter()
router.register(r'departments',DepartmentViewSet)
router.register(r'issues',IssueViewSet)
router.register(r'users',UserViewSet)

#urls

urlpatterns = [
    path('',include(router.urls)),
    #path("login",login,name="login"),
    path('filter_issues',filter_issues,name="filter_issues"),
    path('register/',Registration.as_view(),name = "register"),
    path("token/",TokenObtainPairView.as_view(),name="get_token"),
    path('token/refresh',TokenRefreshView.as_view(),name="refresh_token"),
    path("auth/",include("rest_framework.urls")),
]


