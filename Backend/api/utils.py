from django.core.mail import send_mail
from django.conf import settings

def send_issue_assignment_email(issue):
    """
    Send a plain text email to the lecturer when they are assigned an issue
    """
    if not issue.lecturer or not issue.lecturer.email:
        return False
    
    subject = f"You have been assigned an issue: {issue.category}"
    
    # Get display values for choice fields
    category_display = dict(issue.CATEGORY_CHOICES).get(issue.category, issue.category)
    year_display = dict(issue.YEAR_CHOICES).get(issue.year_of_study, issue.year_of_study)
    
    message = f"""
Dear {issue.lecturer.username},

You have been assigned a new issue to resolve. Please find the details below:

Issue ID: #{issue.id}
Student: {issue.student.username}
Course: {issue.course_name} ({issue.course_code})
Category: {category_display}
Description: {issue.description}
Year of Study: {year_display}
Programme: {issue.programme if issue.programme else "Not specified"}
Department: {issue.department}
Date Submitted: {issue.created_at.strftime("%d %b %Y, %H:%M")}

Please review this issue and take appropriate action.

Thank you,
Academic Registrar {issue.registrar}

This is an automated message. Please do not reply to this email.
"""
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [issue.lecturer.email],
            fail_silently=False
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False



def send_issue_notification_email(issue):
    """
    Send a plain text email to the registrar when a student creates a new issue
    """
    if not issue.registrar or not issue.registrar.email:
        print(f"Cannot send email for issue #{issue.id}: No registrar or registrar email")
        return False
    
    subject = f"New Academic Issue Submitted: {issue.category}"
    
    # Get display values for choice fields
    category_display = dict(issue.CATEGORY_CHOICES).get(issue.category, issue.category)
    year_display = dict(issue.YEAR_CHOICES).get(issue.year_of_study, issue.year_of_study)
    
    message = f"""Dear {issue.registrar.username},

A new academic issue has been submitted by a student and requires your attention.

Issue Details:
Issue ID: #{issue.id}
Student: {issue.student.username}
Course: {issue.course_name} ({issue.course_code})
Category: {category_display}
Description: {issue.description}
Year of Study: {year_display}
Programme: {issue.programme if issue.programme else "Not specified"}
Department: {issue.department}
Date Submitted: {issue.created_at.strftime("%d %b %Y, %H:%M")}

Please review this issue and assign it to an appropriate lecturer.

Thank you,
Academic Issue Tracking System

This is an automated message. Please do not reply to this email.
"""
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [issue.registrar.email],
            fail_silently=False
        )
        print(f"Email notification sent successfully to registrar {issue.registrar.email} for issue #{issue.id}")
        return True
    except Exception as e:
        print(f"Error sending email to registrar: {e}")
        return False

