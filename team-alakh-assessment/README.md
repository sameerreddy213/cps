# Dependency Aware Assessment Generator

Welcome to PreAssess! This project is built by a passionate team to help students master concepts in the right order and give instructors powerful tools to guide and assess learning. We hope you enjoy exploring it as much as we enjoyed building it!

---

## 👥 Team Members
- Alakh Mathur (Team Lead)
- Omkar Kumar
- Anand Jangid
- Pavithra Krishnappa
- Aditya Kumar Das

---

## 🔍 Problem Statement
Create a system that generates formative assessments based on the prerequisite concepts of a target learning objective to ensure readiness before progression.

---

## 🚀 Solution Overview: PreAssess
PreAssess is a modern, full-stack platform for personalized, dependency-aware learning and assessment. It helps students master prerequisite concepts before moving forward, and gives instructors a dashboard to track, manage, and support learners.

---

## ✨ Key Features
- Dependency-based learning paths for students
- Automatic quiz generation based on prerequisites
- Mastery tracking and progress visualization
- Instructor dashboard with analytics and management tools
- Assessment tracking: search, review, and audit all student attempts
- Query system: students can raise questions, instructors can respond and update status
- Audit logs for instructor actions
- Modern, animated UI with a NASA-inspired dark theme

---

## 🛠️ Tech Stack

| Area      | Technology                                    |
|-----------|-----------------------------------------------|
| Frontend  | React, TypeScript, Tailwind CSS, Framer Motion, Axios |
| Backend   | Node.js, Express, MongoDB (Mongoose), Multer, JWT |
| Other     | Audit logging, RESTful API, Role-based access |

---

## 🧩 How It Works
1. Students sign up and are guided through topics in the right order, based on prerequisites.
2. Each topic has a quiz generated from its prerequisites.
3. Mastery is tracked and visualized for each student.
4. Instructors log in to a dashboard to see analytics, manage students/content, and track assessments.
5. Students can raise queries (with attachments); instructors can respond and update status.
6. All instructor actions are logged for transparency.

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```
git clone <your-repo-url>
cd <repo-root>
```

### 2. Backend Setup
```
cd Server
npm install
# Create a .env file with:
# JWT_SECRET=your_jwt_secret
# MONGODB_URI=your_mongodb_connection_string
npm run dev
```

### 3. Frontend Setup
```
cd client
npm install
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 📚 API/Usage Overview
- `/api/instructor/` — Instructor endpoints (dashboard, students, content, assessment tracking, audit logs)
- `/api/user/` — Student endpoints (profile, learning, quizzes, queries)
- `/api/query/` — Query system endpoints
- `/api/instructor/assessment-histories` — Assessment tracking/search for instructors

See the code for more details on API routes and usage.

"Suggestions are welcomed for introducing new functionalities to our dynamic learning system"---Please raise an issue or ping the team lead at mathur.alakh2004@gmail.com
