# 🚀 StudyNotion – Full Stack EdTech Platform (MERN)

> A scalable, production-grade EdTech platform built with the MERN stack, designed to deliver a seamless online learning experience with authentication, payments, and course management.

---

## 🌐 Live Deployment

- 🔗 **Frontend:** https://study-notion-sooty-phi.vercel.app  
- 🔗 **Backend API:** https://studynotion-backend-882z.onrender.com/api/v1  

---

## 🎯 About The Project

StudyNotion is a full-stack **online learning platform** that allows users to:
- Explore courses
- Enroll in paid/free content
- Watch video lectures
- Track learning progress
- Interact via reviews & ratings

Built with a focus on **real-world architecture, scalability, and production deployment.**

---

## ⚡ Core Features

### 👨‍🎓 Student Side
- Secure authentication (JWT-based)
- Course browsing & enrollment
- Video-based learning system
- Progress tracking
- Course reviews & ratings

### 🧑‍🏫 Instructor Side
- Create & manage courses
- Upload video content
- Organize sections & subsections
- View student engagement

### 💳 Payment System
- Razorpay integration for secure transactions
- Real-time payment flow

### ☁️ Cloud Integration
- Cloudinary for media storage
- MongoDB Atlas for database

---

## 🧠 System Design

```text id="arch3"
Frontend (React + Redux)   →  Vercel
Backend (Node + Express)   →  Render
Database (MongoDB Atlas)   →  Cloud DB
Media Storage (Cloudinary) →  Cloud Assets
Payments (Razorpay)       →  Secure Gateway

🛠 Tech Stack
Frontend
React.js (v18)
Redux Toolkit
Tailwind CSS
Axios
React Router DOM
Backend
Node.js
Express.js
MongoDB + Mongoose
JWT Authentication
Bcrypt.js
Nodemailer
DevOps / Deployment
Vercel (Frontend Hosting)
Render (Backend Hosting)
MongoDB Atlas (Database)
Cloudinary (Media Storage)
📁 Project Structure
StudyNotion/
│
├── src/              # Frontend (React)
├── server/           # Backend (Node + Express)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   └── utils/
│
├── public/
└── package.json
⚙️ Environment Variables
Backend
PORT=4000
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_secret
RAZORPAY_KEY=your_key
RAZORPAY_SECRET=your_secret
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret
Frontend
REACT_APP_BASE_URL=https://studynotion-backend-882z.onrender.com/api/v1
REACT_APP_RAZORPAY_KEY=your_key
🚀 Local Setup
git clone https://github.com/priyESH88088/StudyNotion.git

npm install
cd server && npm install

npm run dev
🏆 What Makes This Project Special
Production-level deployment (not just local project)
Clean REST API architecture
Scalable backend structure
Real-world payment integration
Cloud-based media handling
Role-based system (Student + Instructor)
Fully deployed full-stack application
👨‍💻 Developer

Priyesh Dwivedi
GitHub: https://github.com/priyESH88088

⭐ Final Note

This project was built as a full-stack learning + production deployment experience, focusing on real-world development practices and scalable architecture.
