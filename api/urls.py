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
router.register(r'raise-issue',StudentRaiseIssueView,basename='student-raise-issue')




urlpatterns = [
    path('',include(router.urls)),
    path('registration/',UserRegistrationView.as_view(),name = "register_users"),
    path("login/",login,name="login"),
    path('logout/',logout,name="logout"),
    path('filter_issues',filter_issues,name="filter_issues"),
    path('verify-email/',VerifyEmailView.as_view(),name="email-verification"),
    path('resend-verification-code/',resend_verification_code,name='student-resend-code'),
    path('password-reset/request/', request_password_reset, name='request-password-reset'),
    path('password-reset/verify-code/', verify_password_reset_code, name='verify-password-reset-code'),
    path('password-reset/set-password/', set_new_password, name='set-new-password'),
    path('registrar/issues/summary/',RegistrarDashboardCountView.as_view(),name="registrar-issues-dashboard"),
    path('student/issues/summary/',StudentDashboardCountView.as_view(),name="student-issues-dashboard"),
    path('lecturer/issues/summary/',LecturerDashboardCountView.as_view(),name="student-issues-dashboard"),
    path('student-profile/',StudentProfileView.as_view(),name='student-profle'),
    path('lecturer-profile/',LecturerProfileView.as_view(),name='lecturer-profle'),
    path('registrar-profile/',LecturerProfileView.as_view(),name='registrar-profle'),
    path('registrar-dashboard/',RegistrarDashboardCountView.as_view(),name='registrar-dashboard'),
    path('student-dashboard/',StudentDashboardCountView.as_view(),name='student-dashboard'),
    path('lecturer-dashboard/',LecturerDashboardCountView.as_view(),name='lecturer-dashboard'),

    path("token/",TokenObtainPairView.as_view(),name="get_token"),
    path('token/refresh',TokenRefreshView.as_view(),name="refresh_token"),
    path("auth/",include("rest_framework.urls")),
]


