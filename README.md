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
│   │   │   ├── userController.js     # Get users, update profile
│   │   │   ├── taskController.js     # Create, update, delete tasks, drag-drop status
│   │   │   ├── analyticsController.js # Get task statistics for dashboard
│   │   │   └── archiveController.js  # Get archived tasks, handle deletion
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth/login, /register
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
│   ├── .env.example
│   ├── package.json
│   └── server.js                     # Start server here
│
├── frontend/
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
│   │   │   ├── Navbar.jsx            # Top navigation bar
│   │   │   ├── KanbanBoard.jsx       # Drag-drop board (ONGOING/DONE/CANCELLED)
│   │   │   ├── TaskCard.jsx          # Single task card
│   │   │   ├── TaskForm.jsx          # Create/edit task modal
│   │   │   ├── AnalyticsChart.jsx    # Charts for dashboard
│   │   │   └── ArchiveList.jsx       # List of archived tasks
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Register.jsx          # Sign up page
│   │   │   ├── Dashboard.jsx         # Analytics overview (charts, stats)
│   │   │   ├── Workspace.jsx         # Kanban board (main workspace)
│   │   │   └── Archive.jsx           # Archived tasks page
│   │   │
│   │   ├── App.jsx                   # Main app component
│   │   ├── index.js                  # React entry point
│   │   └── index.css                 # Global styles
│   │
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md



```