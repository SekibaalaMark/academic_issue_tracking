from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView


router = DefaultRouter()
router.register(r'departments',DepartmentViewSet)
router.register(r'issues',IssueViewSet)
router.register(r'users',UserViewSet)
router.register(r'lecturer-issue-management',LecturerIssueManangementView,basename='lecturer-issues-management')
router.register(r'student-issues',StudentIssueReadOnlyViewset,basename='student-issues-read')
router.register(r'registrar-issues-management',RegistrarIssuesMonitorViewSet,basename='registrar-issues-manager')
router.register(r'assignlecturer',AssignIssueViewSet,basename='assign-lecturer')
router.register(r'raise-issue',StudentCreateIssueView,basename='student-raise-issue')

#urls
# Add these to your existing urls.py file




urlpatterns = [
    path('',include(router.urls)),
    path('register/student/',StudentRegistrationView.as_view(),name = "register_studentr"),
    path('register/lecturer/',LecturerRegistrationView.as_view(),name = "register_lecturer"),
    path('register/registrar/',RegistrarRegistrationView.as_view(),name = "register_registrar"),
    path("login/student/",student_login,name="student-login"),
    path("login/lecturer/",lecturer_login,name="lecturer-login"),
    path("login/registrar/",registrar_login,name="registrar-login"),
    path('logout/',logout,name="logout"),
    path('filter_issues',filter_issues,name="filter_issues"),
    path('verify-email/',VerifyEmailView.as_view(),name="email-verification"),
    path('resend-verification-code/',resend_verification_code,name='student-resend-code'),
    path('password-reset/request/', request_password_reset, name='request-password-reset'),
    path('password-reset/verify-code/', verify_password_reset_code, name='verify-password-reset-code'),
    path('password-reset/set-password/', set_new_password, name='set-new-password'),

    path("token/",TokenObtainPairView.as_view(),name="get_token"),
    path('token/refresh',TokenRefreshView.as_view(),name="refresh_token"),
    path("auth/",include("rest_framework.urls")),
]


