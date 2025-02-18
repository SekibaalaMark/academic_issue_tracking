from rest_framework.serializers import ModelSerializer
from . models import Issue,Department,User
from rest_framework import serializers

class IssueSerializer(ModelSerializer):
    class Meta:
        model= Issue
        fields = '__all__'

class DepartmentSerializer(ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name','last_name',"email","role"]


class RegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name','last_name',"email",'username','password']
    def validate(self,data):
        username = data['username']
        email = data['email']
        if username:
            if User.objects.filter(username=username).exists():
                raise serializers.ValidationError('username already exists')
        if email:
            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError("email already exists")
            return data
