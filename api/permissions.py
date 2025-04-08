from django.contrib.auth.models import Group,Permission
from django.core.management.base import BaseCommand
from django.contrib.contenttypes.models import ContentType
from .models import CustomUser,Issue,Department

class Command(BaseCommand):
    help="setup roles and permissions"
    def handle(self,*args,**kwargs):
        student_group ,created = Group.objects.get_or_create(name="Students")
        registrar_group,created=Group.objects.get_or_create(name="Registrars")

        content_type = ContentType.objects.get_for_model(Issue)

        report_permission = Permission.objects.get(codename="report_issue",content_type=content_type)
        assign_permission = Permission.objects.get(codename="assign_issue",content_type=content_type)

        student_group.permissions.add(report_permission)
        registrar_group.permissions.add(assign_permission)

        self.stdout.write(self.style.SUCCESS("Roles and permissions have been set up!"))
        