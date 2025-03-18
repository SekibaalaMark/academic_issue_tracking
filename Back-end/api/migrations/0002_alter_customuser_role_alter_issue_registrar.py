# Generated by Django 5.1.6 on 2025-03-18 11:53

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='role',
            field=models.CharField(choices=[('student', 'Student'), ('lecturer', 'Lecturer'), ('registrar', 'Registrar')], default='student', max_length=20),
        ),
        migrations.AlterField(
            model_name='issue',
            name='registrar',
            field=models.ForeignKey(limit_choices_to={'role': 'registrar'}, on_delete=django.db.models.deletion.CASCADE, related_name='registra_issues', to=settings.AUTH_USER_MODEL),
        ),
    ]
