from rest_framework import status
from .serializers import DepartmentSerializer,UserSerializer,IssueSerializer
from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import Issue,Department,User
from rest_framework.response import Response

@api_view(['GET','POST','PUT','PATCH','DELETE'])
def department(request):
    if request.method == 'GET':
        all_objs = Department.objects.all()
        serializer = DepartmentSerializer(all_objs, many = True)

        return Response(serializer.data)
    elif request.method == 'POST':
        data = request.data
        serializer = DepartmentSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
    elif request.method == "PUT":
        data = request.data
        all = Department.objects.get(id = data['id'])
        serializer = DepartmentSerializer(all, data = data,partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)