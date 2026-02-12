# Boy-Scouts-of-the-Philippines---Paranaque-City-Council

```
boy-scout-task-manager/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js          # Supabase client setup
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js               # Check if user is logged in
│   │   │   └── errorHandler.js       # Handle errors
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js     # Login, register, logout
│   │   │   ├── adminController.js
│   │   │   ├── userController.js     # Get users, update profile
│   │   │   ├── taskController.js     # Create, update, delete tasks, drag-drop status
│   │   │   ├── analyticsController.js # Get task statistics for dashboard
│   │   │   └── archiveController.js  # Get archived tasks, handle deletion
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth/login, /register
│   │   │   ├── adminRoutes.js
│   │   │   ├── userRoutes.js         # /api/users
│   │   │   ├── taskRoutes.js         # /api/tasks (CRUD + update status)
│   │   │   ├── analyticsRoutes.js    # /api/analytics (dashboard stats)
│   │   │   └── archiveRoutes.js      # /api/archive (archived tasks)
│   │   │
│   │   ├── jobs/
│   │   │   └── taskCleanup.js        # Cron job: move DONE→archive (30d), delete archive (90d)
│   │   │
│   │   └── app.js                    # Express app setup
│   │
│   ├── .env
│   ├── package.json
│   └── server.js                     # Start server here
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   │   ├── index.html
│   │   └── images/
│   │       ├── logo.png              # Boy Scout logo
│   │       └── icons/
│   │           └── task-icon.png
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   │   └── background.jpg
│   │   │   └── icons/
│   │   │       └── menu-icon.svg
│   │   │
│   │   ├── components/
│   │   │   ├── NavBar.jsx            # Top navigation bar
│   │   │   ├── KanBanBoard.jsx       # Drag-drop board (ONGOING/DONE/CANCELLED)
│   │   │   ├── TaskCard.jsx          # Single task card
│   │   │   ├── TaskForm.jsx          # Create/edit task modal
│   │   │   ├── AnalyticsChart.jsx    # Charts for dashboard
│   │   │   └── ArchiveList.jsx       # List of archived tasks
│   │   │   └── UserForm.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── AdminManagement.jsx
│   │   │   ├── RoleSection.jsx       # Admin or scout
│   │   │   ├── Register.jsx          # Sign up page
│   │   │   ├── Dashboard.jsx         # Analytics overview (charts, stats)
│   │   │   ├── Workspace.jsx         # Kanban board (main workspace)
│   │   │   └── Archive.jsx           # Archived tasks page
│   │   │
│   │   ├── App.jsx                   # Main app component
│   │   ├── index.js                  # React entry point
│   │   └── index.css                 # main file
│   │   └── styles/
│   │       ├── reset.css
│   │       ├── auth.css
│   │       ├── layout.css
│   │       ├── kanban.css
│   │       ├── modal.css
│   │       ├── dashboard.css
│   │       ├── archive.css
│   │       ├── admin.css
│   │       └── responsive.css 
│   │
│   ├── .env
│   └── package-lock.json
│   └── package.json
│
├── .gitignore
└── README.md



```

```
#FIRST TIME RUNNING
cd backend 
npm install (install dependencies if not already installed)
npm start

cd frontend
npm install (install dependencies if not already installed)
npm start

#TO RUN THE PROGRAM

//terminal 1
cd backend
npm start


//terminal 2
cd frontend
npm start


```



```
Boy Scout Task Management System - Project Overview
Project Description
A Jira-style task management system designed for Boy Scout organizations to track and manage tasks, activities, and assignments. The system features a drag-and-drop Kanban board interface with automated task lifecycle management.
Core Features
1. Workspace (Kanban Board)

Visual board with 3 columns: ONGOING, DONE, and CANCELLED
Create new tasks with details (title, description, assigned scout, due date, etc.)
Drag and drop tasks between columns to update their status
Real-time updates when tasks are moved

2. Dashboard (Analytics)

Overview of all tasks across all statuses
Visual analytics and statistics:

Total tasks created
Completion rate
Tasks by status (pie/bar charts)
Overdue tasks count
Recent activity timeline



3. Archive System

Automated Lifecycle Management:

When a task is moved to DONE, it stays visible for 30 days
After 30 days, the task automatically moves to the Archive page
Archived tasks are retained for 90 days
After 90 days in archive, tasks are permanently deleted from the system


Archive page displays all archived tasks with remaining days before deletion
Users can view archived tasks for reference but cannot edit them

4. User Authentication

Login and registration system
Role-based access (Leaders, Scouts)
Secure authentication using JWT tokens

Tech Stack

Frontend: React.js
Backend: Node.js + Express.js
Database: Supabase (PostgreSQL)
Features: Drag-and-drop, automated cron jobs for task cleanup, real-time updates

User Flow

User logs in → Redirected to Dashboard
Dashboard shows analytics and overview
Navigate to Workspace → See Kanban board
Create tasks → Tasks appear in ONGOING column
Drag tasks to DONE or CANCELLED as work progresses
Completed tasks automatically archive after 30 days
View archived tasks in Archive page (deleted after 90 days)


```