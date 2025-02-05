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
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
    elif request.method == "PUT":
        data = request.data
        department_instance= Department.objects.get(id = data['id'])
        serializer = DepartmentSerializer(department_instance, data = data,partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


#ISSUES SERIALIZER
@api_view(['GET','POST','PUT','PATCH','DELETE'])
def issues(request):
    if request.method == 'GET':
        issues = Issue.objects.all()
        serializer = IssueSerializer(issues,many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        data = request.data 
        serializer=IssueSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        data = request.data
        issue_instance = Issue.objects.get(id=data['id'])
        serializer = IssueSerializer(issue_instance,data=data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        



