from rest_framework import status
from .serializers import *
from django.shortcuts import render
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
    

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anyone to access this view
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
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


