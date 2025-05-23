# Academic Issue Tracking System (AITS)
A web based platform for students to log, track, and have their academic issues like missing marks, appeals, and corrections resolved. The system  includes role-based access for students, lecturers and the Academic Registrar.
## Features
1. User Roles and Permissions:
   - Students can log issues and view their status.
   - Academic Registrar can review issues, resolve them, or assign them to relevant lecturers.
   - Lecturers can resolve assigned issues and update statuses.
2. Issue Management:
   - Students must provide relevant details, such as course code and issue type.
   - Issues are categorized into "missing marks," ", or "wrong marks", "wrong grading" or "Other"
3. Notifications:
   - Email or in-app notifications for status changes.
   - Alerts for overdue or unresolved issues.
5. Dashboard:
   - A personalized dashboard for each user role displaying relevant tasks and updates.
6. Audit Trail:
   - Maintain a log of actions performed on each issue
## Tech Stack
1. Backend:
   - Framework: Django
   - Database: PostgreSQL
   - APIs: Django REST Framework
2. Frontend:
   - Framework: React
   - State Management: Redux
   - Notifications: React Toastify
3. Hosting and Deployment:
   - Cloud Platform: Heroku $ Render
   - Version Control: Git/HitHub
4. Testing:
   - Backend: Pytest
   - Frontend: Jest and React Testing Library
5. Security:
   - Role based access control
   - Input validation and sanitation
## Development Methodology
   - Agile Methodology


## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details