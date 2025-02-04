from serializers import DepartmentSerializer,UserSerializer,IssueSerializer
from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import Issue,Department,User
from rest_framework.response import Response

@api_view(['GET','POST','PUT','PATCH','DELETE'])
def department(request):
    if request.method == 'GET':
        all_objs = Department.objects.all()
        serializer = DepartmentSerializer(data = all_objs, many = True)

        return Response(serializer.data)
    elif request.method == 'POST':
        data = request.data
        serializer = DepartmentSerializer(data = data, many = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
