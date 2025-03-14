from rest_framework.serializers import ModelSerializer
from . models import Issue,Department,CustomUser
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
        model = CustomUser
        fields = ['id','first_name','last_name',"email","role"]
        extra_kwargs = {"password":{"write_only":True}}

    def create(self,validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user


class RegisterSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','first_name','last_name',"email",'username','password','password_confirmation']

        extra_kwargs = {'password':{'write_only':True},'password_confirmation':{'write_only':True}}
    def validate(self,data):
        username = data['username']
        email = data['email']
        password = data['password']
        password_confirmation = data['password_confirmation']

        if username:
            if CustomUser.objects.filter(username=username).exists():
                raise serializers.ValidationError('username already exists')
        if email:
            if CustomUser.objects.filter(email=email).exists():
                raise serializers.ValidationError("email already exists")
        
        # Check if password and password confirmation match
        if password != password_confirmation:
            raise serializers.ValidationError("Passwords do not match")
        return data

