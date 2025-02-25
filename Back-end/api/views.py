from rest_framework import status
from .serializers import DepartmentSerializer,UserSerializer,IssueSerializer,RegisterSerializer
from django.shortcuts import render
from .models import Issue,Department,CustomUser
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import APIView
from rest_framework.permissions import IsAuthenticated,AllowAny


#DEPARTMENT API VIEW

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset=CustomUser.objects.all()
    serializer_class = UserSerializer
    


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