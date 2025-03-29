from rest_framework import status
from .serializers import *
from django.shortcuts import render,redirect
from .models import *
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import APIView
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from django.contrib.auth import authenticate
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.contrib.auth.models import Group
from rest_framework_simplejwt.exceptions import TokenError
from django.utils.encoding import force_str  # Importing force_str
from django.core.mail import send_mail,EmailMessage
from django.views.decorators.csrf import csrf_exempt
from rest_framework import serializers
from django.shortcuts import render, redirect
from django.utils.http import urlsafe_base64_decode
from django.contrib import messages
from django.utils.http import urlsafe_base64_decode
from django.contrib import messages
from django.contrib.auth.tokens import default_token_generator  # Make sure this is imported
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from django.shortcuts import render, redirect
from django.utils.http import urlsafe_base64_decode
from django.contrib import messages
User = CustomUser


#DEPARTMENT API VIEW

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes=[IsAuthenticated]

class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        # Ensure that only students can create issues
        if self.request.user.role != 'student':
            return Response({"detail": "Only students can raise issues."}, status=status.HTTP_403_FORBIDDEN)
        serializer.save(student=self.request.user)




class AssignIssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = AssignIssueSerializer

    def partial_update(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            issue = Issue.objects.get(pk=pk)
        except Issue.DoesNotExist:
            return Response({"detail": "Issue not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role != 'registrar':
            return Response({"detail": "Only registrars can assign issues to lecturers."}, status=status.HTTP_403_FORBIDDEN)

        # Print request data for debugging
        print(f"Request data: {request.data}")
        
        serializer = AssignIssueSerializer(issue, data=request.data, partial=True)
        if serializer.is_valid():
            # Save with explicit commit
            updated_issue = serializer.save()
            # Verify the update happened
            print(f"Updated issue lecturer: {updated_issue.lecturer}")
            
            # Refresh from DB to confirm changes were saved
            issue.refresh_from_db()
            print(f"Issue after refresh: {issue.lecturer}")
            
            return Response(serializer.data)
        else:
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class UserViewSet(viewsets.ModelViewSet):
    queryset=CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    
class ProgrammeViewSet(viewsets.ModelViewSet):
    queryset= Programme.objects.all()
    serializer_class= ProgrammeSerializer
    permission_classes= [IsAuthenticated]



@api_view(['GET'])
def filter_issues(request):
    """
    Filter issues based on various criteria including status, category, and user role.
    Registrars and lecturers will only see issues assigned to them.
    """
    # Get filter parameters from request
    status = request.GET.get('status', None)
    category = request.GET.get('category', None)
    
    # Start with all issues
    issues_qs = Issue.objects.all()
    
    # Filter based on user role
    user = request.user
    if user.role == 'lecturer':
        # Lecturers only see issues assigned to them
        issues_qs = issues_qs.filter(lecturer=user)
    elif user.role == 'registrar':
        # Registrars only see issues assigned to them
        issues_qs = issues_qs.filter(registrar=user)
    elif user.role == 'student':
        # Students only see their own issues
        issues_qs = issues_qs.filter(student=user)
    
    # Apply additional filters if provided
    if status:
        issues_qs = issues_qs.filter(status=status)
    
    if category:
        issues_qs = issues_qs.filter(category=category)
    
    # Optional: Add sorting
    issues_qs = issues_qs.order_by('-created_at')  # Most recent first
    
    serializer = IssueSerializer(issues_qs, many=True)
    return Response(serializer.data)





class StudentCreateIssueView(viewsets.ModelViewSet):
    serializer_class = IssueSerializer
    permission_classes=[IsAuthenticated]
    def perform_create(self, serializer):
        if self.request.user.role =='student':
            if serializer.is_valid():
                return Response({"detail": "Only students can raise issues."}, status=status.HTTP_403_FORBIDDEN)
            serializer.save(student=self.request.user)
            


class StudentRegistrationView(APIView):
    def post(self,request):
        data = request.data 
        serializer = StudentRegistrationSerializer(data=data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            password = validated_data.pop('password')
            validated_data.pop('password_confirmation')  #This removes the password_confirmation before creating a user to avoid errors
            
            user = CustomUser(**validated_data)
            user.set_password(password)
            user.save()
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            verification_code = randint(10000,99999)
            verification,created = VerificationCode.objects.get_or_create(
                user = user,
                defaults={"code": verification_code})
            
            verification.code = verification_code
            #verification_code.created_at = timezone.now()
            verification.save()
            
            '''Sending the email...
            subject = 'Email verification Code..'
            message = f"Hello, your Verification code is: {verification_code}"
            receipient_email= data.get('email')
            
            try:
                send_mail(subject,message,settings.EMAIL_HOST_USER,[receipient_email],fail_silently=False)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            '''
            subject = 'Email Verification Code'
            message = f"Hello, your Verification code is: {verification_code}"
            recipient_email = data.get('email')

            email = EmailMessage(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [recipient_email]
            )

            email.send(fail_silently=False)
            

            return Response({
                "message": "User  Created Successfully",
                'data': validated_data,
                "tokens": {
                    "refresh": str(refresh),
                    "access": access_token
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    



class LecturerRegistrationView(APIView):
    def post(self,request):
        data = request.data 
        serializer = LecturerRegistrationSerializer(data=data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            password = validated_data.pop('password')
            validated_data.pop('password_confirmation')  #This removes the password_confirmation before creating a user to avoid errors
            
            user = CustomUser(**validated_data)
            user.set_password(password)
            user.save()
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({
                "message": "User  Created Successfully",
                'data': validated_data,
                "tokens": {
                    "refresh": str(refresh),
                    "access": access_token
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class RegistrarRegistrationView(APIView):
    def post(self,request):
        data = request.data 
        serializer = RegistrarRegistrationSerializer(data=data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            password = validated_data.pop('password')
            validated_data.pop('password_confirmation')  #This removes the password_confirmation before creating a user to avoid errors
            
            user = CustomUser(**validated_data)
            user.set_password(password)
            user.save()
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({
                "message": "User  Created Successfully",
                'data': validated_data,
                "tokens": {
                    "refresh": str(refresh),
                    "access": access_token
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    



@method_decorator(csrf_exempt, name='dispatch')
class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = VerifyEmailSerializer(data=data)
        if serializer.is_valid():
            verification_code = serializer.validated_data.get('code')
            user_email = serializer.validated_data.get('email')
            
            try:
                user = CustomUser.objects.get(email=user_email)
            except CustomUser.DoesNotExist:
                return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)

            try:
                verification = VerificationCode.objects.get(user=user, code=verification_code)
                
                if verification.is_verification_code_expired():
                    return Response({'error': 'Verification Code has expired..'}, status=status.HTTP_400_BAD_REQUEST)
                
                verification.is_code_verified = True
                verification.save()
                
                user.is_email_verified = True
                user.save()
                return Response({'Message': 'Email verified successfully...'}, status=status.HTTP_200_OK)
                
            except VerificationCode.DoesNotExist:
                return Response({'error': 'Verification Code does not exist..'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification_code(request):
    data = request.data
    serializer = ResendVerificationCodeSerializer(data = data)
    if serializer.is_valid():
        user_email = serializer.validated_data.get('email')
        try:
            user = CustomUser.objects.get(email = user_email)
        except CustomUser.DoesNotExist:
            return Response({'Error':'No user found...'})
        
        result = VerificationCode.resend_verification_code(user = user)
        if result:
            return Response({'Message':f'Successful.....'},status=status.HTTP_200_OK)
        return Response({'Error':'Failure...........--'},status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)
  
    

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anyone to access this view
def student_login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.role != 'student':
                return Response({'success': False, 'message': 'Only Students are allowed to login from here!'}, status=status.HTTP_401_UNAUTHORIZED)
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'success': True,
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)
        else:
            return Response({'success': False, 'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anyone to access this view
def lecturer_login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.role != 'lecturer':
                return Response({'success': False, 'message': 'You must be a lecturer to login!'}, status=status.HTTP_401_UNAUTHORIZED)
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'success': True,
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)
        else:
            return Response({'success': False, 'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anyone to access this view
def registrar_login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.role != 'registrar':
                return Response({'success': False, 'message': 'Only Registrars are allowed to login from here!'}, status=status.HTTP_401_UNAUTHORIZED)
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'success': True,
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)
        else:
            return Response({'success': False, 'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    





class LecturerIssueManangementView(viewsets.ModelViewSet):
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self): 
        user = self.request.user
        return Issue.objects.filter(lecturer = user)
    
    def send_email_on_update(self,issue,action,previous_state):
        student = issue.student
        
        if student and student.email:
            subject = f'Issue {action} Notification'
            if previous_state:
                message = (f'Dear {student.username},\n\n'
                           f'Your issue of {issue.category} has been {action}.\n'
                           f'Previous status: {previous_state}\n'
                           f'Current status: {issue.status}\n\n'
                           'Best regards,\nAITS')
            else:
                message = (f'Dear {student.username},\n\n'
                           f'Your issue of {issue.category} has been {action}.\n'
                           f'Current status: {issue.status}\n\n'
                           'Best regards,\nAITS')
            
            send_mail(subject, message, settings.EMAIL_HOST_USER, [student.email], fail_silently=False)
    
    def perform_update(self, serializer):
        issue = self.get_object()  # This retrieves the current issue instance
        previous_state = issue.status  # Store the previous state of the issue
        
        # Save the updated issue
        updated_issue = serializer.save()
        
        # Send email with previous and current state
        self.send_email_on_update(updated_issue, "updated", previous_state)
        
        return updated_issue
            
    def perform_destroy(self, instance):
        self.send_email_on_update(instance,"deleted")
        instance.delete()
    
class StudentIssueReadOnlyViewset(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = IssueSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Issue.objects.filter(student = user)
    
class RegistrarIssuesMonitorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = IssueSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Issue.objects.filter(registrar = user)
    
    def send_email_on_update(self,issue,action,previous_state):
        student = issue.student
        
        if student and student.email:
            subject = f'Issue {action} Notification'
            if previous_state:
                message = (f'Dear {student.username},\n\n'
                           f'Your issue of {issue.category} has been {action}.\n'
                           f'Previous status: {previous_state}\n'
                           f'Current status: {issue.status}\n\n'
                           'Best regards,\nAITS')
            else:
                message = (f'Dear {student.username},\n\n'
                           f'Your issue of {issue.category} has been {action}.\n'
                           f'Current status: {issue.status}\n\n'
                           'Best regards,\nAITS')
            
            send_mail(subject, message, settings.EMAIL_HOST_USER, [student.email], fail_silently=False)
    
    def perform_update(self, serializer):
        issue = self.get_object()  # This retrieves the current issue instance
        previous_state = issue.status  # Store the previous state of the issue
        
        # Save the updated issue
        updated_issue = serializer.save()
        
        # Send email with previous and current state
        self.send_email_on_update(updated_issue, "updated", previous_state)
        
        return updated_issue
            
    def perform_destroy(self, instance):
        self.send_email_on_update(instance,"deleted")
        instance.delete()







#Log out view
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Only authenticated users can access this view
def logout(request):
    try:
        # Get the refresh token from the request
        refresh_token = request.data.get('refresh')
        access_token = request.data.get('access')
        
        # Blacklist the refresh token
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()  # This will add the token to the blacklist
        
        if access_token:
            token = AccessToken(access_token)
            token.blacklist() #This will add the token to blacklist too


        return Response({'success': True, 'message': 'Logout successful'}, status=status.HTTP_205_RESET_CONTENT)
    except TokenError as e:
        return Response({'success': False, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'success': False, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)




def verify_email(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.email_is_verified = True
        user.save()
        messages.success(request, 'Your email has been verified.')
        return redirect('home')
    else:
        messages.warning(request, 'The verification link is invalid.')
        return redirect('signup')




    
    '''
    def assign_user_group(self, user):
        """Assign user to a group based on their role."""
    role_to_group = {
        "student": "Students",
        "lecturer": "Lecturers",
        "academic_registrar": "Registrars"
    }
    
    group_name = role_to_group.get(user.role)  # Get the group name based on role
    if group_name:
        group, created = Group.objects.get_or_create(name=group_name)  # Ensure group exists
        user.groups.add(group)
        '''
    

'''
# Login View
@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anyone to access this view
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user is not None:
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'success': True,
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    else:
        return Response({'success': False, 'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        '''


