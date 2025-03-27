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

from django.shortcuts import render, redirect
from django.utils.http import urlsafe_base64_decode
from django.contrib import messages
User = CustomUser

from django.utils.http import urlsafe_base64_decode
from django.contrib import messages
from django.contrib.auth.tokens import default_token_generator  # Make sure this is imported






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
        serializer.save(raised_by=self.request.user)


class IssueAssignViewSet(viewsets.ViewSet):
    queryset = Issue.objects.all()
    permission_classes = [IsAuthenticated]

    def update(self, request, pk=None):
        issue = Issue.objects.get(pk=pk)

        # Ensure that only registrars can assign issues
        if request.user.role != 'registrar':
            return Response({"detail": "Only registrars can assign issues."}, status=status.HTTP_403_FORBIDDEN)

        serializer = AssignIssueSerializer(issue, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
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
    status = request.GET.get('status', None)
    issues_qs = Issue.objects.all()
    
    if status:
        issues_qs = issues_qs.filter(status=status)
    
    serializer = IssueSerializer(issues_qs, many=True)
    return Response(serializer.data)


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
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

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






'''    
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request):
    data = request.data
    serializer = VerifyEmailSerializer(data = data)
    if serializer.is_valid():
        verification_code = serializer.validated_data.get('code')
        user_email = serializer.validated_data.get('email')
        
        try:
            user = CustomUser.objects.get(email=user_email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)

        try:
            verification = VerificationCode.objects.get(user = user,code = verification_code)
            
            if verification.is_verification_code_expired():
                return Response({'error':'Verification Code has expired..'},status = status.HTTP_400_BAD_REQUEST)
            
            verification.is_code_verified = True
            verification.save()
            
            user.is_email_verified = True
            user.save()
            return Response({'Message':'Email verified successfully...'},status = status.HTTP_200_OK)
            
            
        except VerificationCode.DoesNotExist:
            return Response({'error':'Verification Code doesnot exist..'},status = status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)
'''

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













































































from django.shortcuts import render, redirect
from django.utils.http import urlsafe_base64_decode
from django.contrib import messages
User = CustomUser

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


