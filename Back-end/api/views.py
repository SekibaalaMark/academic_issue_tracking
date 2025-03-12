from rest_framework import status
from .serializers import DepartmentSerializer,UserSerializer,IssueSerializer,RegisterSerializer
from django.shortcuts import render
from .models import Issue,Department,CustomUser
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import APIView
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from django.contrib.auth import authenticate
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken




#DEPARTMENT API VIEW

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes=[IsAuthenticated]

class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]

class UserViewSet(viewsets.ModelViewSet):
    queryset=CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class Registration(APIView):
    def post(self,request):
        data = request.data 
        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            password = validated_data.pop('password')
            
            user = CustomUser(**validated_data)
            user.set_password(password)
            user.save()
            return Response({
                "message":"User Created Successfully",
                "data":validated_data
            }, status= status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

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


#Log out view
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Only authenticated users can access this view
def logout(request):
    try:
        # Get the refresh token from the request
        refresh_token = request.data.get('refresh')
        
        # Blacklist the refresh token
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()  # This will add the token to the blacklist
            
        return Response({'success': True, 'message': 'Logout successful'}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({'success': False, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)\'
'''


