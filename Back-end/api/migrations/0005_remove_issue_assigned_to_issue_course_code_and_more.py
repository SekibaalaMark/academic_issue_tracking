# Generated by Django 5.1.5 on 2025-02-07 12:56

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_department_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='issue',
            name='assigned_to',
        ),
        migrations.AddField(
            model_name='issue',
            name='course_code',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='issue',
            name='couse_name',
            field=models.CharField(max_length=150, null=True),
        ),
        migrations.AddField(
            model_name='issue',
            name='registrar',
            field=models.ForeignKey(limit_choices_to={'role': 'Registrar'}, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='registra_issues', to=settings.AUTH_USER_MODEL),
        ),
    ]
