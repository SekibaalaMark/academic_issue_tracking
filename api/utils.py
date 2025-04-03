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
Dear {issue.lecturer.get_full_name() or issue.lecturer.username},

You have been assigned a new issue to resolve. Please find the details below:

Issue ID: #{issue.id}
Student: {issue.student.get_full_name() or issue.student.username}
Course: {issue.course_name} ({issue.course_code})
Category: {category_display}
Description: {issue.description}
Year of Study: {year_display}
Programme: {issue.programme.programme_name if issue.programme else "Not specified"}
Department: {issue.department.name}
Date Submitted: {issue.created_at.strftime("%d %b %Y, %H:%M")}

Please review this issue and take appropriate action.

Thank you,
Academic Registry

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
