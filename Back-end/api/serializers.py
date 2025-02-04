from rest_framework.serializers import ModelSerializer
from . models import Issue,Department,User


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
        fields = '__all__'


