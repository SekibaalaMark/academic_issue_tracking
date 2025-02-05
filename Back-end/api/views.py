from rest_framework import status
from .serializers import DepartmentSerializer,UserSerializer,IssueSerializer
from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import Issue,Department,User
from rest_framework.response import Response

#DEPARTMENT API VIEW
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
    


#ISSUES API VIEW
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
        
    elif request.method == "DELETE":
        data = request.data 
        try:
            issue_instace = Issue.objects.get(id=data['id'])
        except Issue.DoesNotExist:
            return Response({'message':'not not found'},status=status.HTTP_404_NOT_FOUND)
        issue_instace.delete()
        return Response({'message':'issue deleted succesfully'},status=status.HTTP_204_NO_CONTENT)
    
    elif request.method == "PATCH":
        data = request.data
        try:
            issue_instace = Issue.objects.get(id=data['id'])
        except Issue.DoesNotExist:
            return Response({"error": "Issue not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = IssueSerializer(issue_instace,data=data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

        

#USER API VIEW
@api_view(['GET','POST','PUT','PATCH','DELETE'])
def user(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users,many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        data = request.data 
        serializer=UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        data = request.data
        user_instace = User.objects.get(id=data['id'])
        serializer = UserSerializer(user_instace,data=data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        data = request.data 
        try:
            user_instace = User.objects.get(id=data['id'])
        except User.DoesNotExist:
            return Response({'message':'User not found'},status=status.HTTP_404_NOT_FOUND)
        user_instace.delete()
        return Response({'message':'user deleted succesfully'},status=status.HTTP_204_NO_CONTENT)

    elif request.method == "PATCH":
        data = request.data
        try:
            user_instace = User.objects.get(id=data['id'])
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user_instace,data=data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        


