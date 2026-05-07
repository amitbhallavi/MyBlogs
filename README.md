<div align="center">

# ✍️ MyBlogs

### A modern full-stack blogging platform for writers, creators, and readers.

MyBlogs is a clean and responsive blog application where users can create, publish, explore, and manage blog posts with authentication and a smooth reading experience.

<br />

![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-State_Management-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render&logoColor=black)

</div>

---

## 🚀 Live Demo

- **Frontend:** Add your Vercel link here  
- **Backend:** Add your Render API link here  

Example:

```txt
Frontend: https://your-blog-app.vercel.app
Backend: https://your-blog-api.onrender.com
📌 About The Project

MyBlogs is a full-stack MERN blog application built for users who want a simple, beautiful, and fast writing platform.

Users can register, log in, create posts, explore blogs, read full articles, and manage their own content from a dashboard.

The project is designed with a modern UI, clean architecture, Redux Toolkit for state management, and a production-ready backend API.

✨ Features
👤 Authentication
User register
User login
Protected routes
JWT-based authentication
Persistent auth state
📝 Blog Management
Create blog posts
View all blogs
View single blog detail page
Edit own blogs
Delete own blogs
Dashboard feed for user content
🔍 Explore & Feed
Explore latest blogs
Read full blog posts
Clean card-based UI
Responsive layout
🎨 UI / UX
Modern clean interface
Responsive design
Toast notifications
Smooth user experience
Professional blog-style layout
⚙️ Backend API
REST APIs
MongoDB database
Mongoose models
Express controllers/routes
Error handling
CORS setup for frontend deployment
🛠️ Tech Stack
Frontend
React.js
Redux Toolkit
React Router
Axios
Vite
Tailwind CSS / CSS
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
bcrypt.js
CORS
dotenv
Deployment
Frontend: Vercel
Backend: Render
Database: MongoDB Atlas
📂 Project Structure
MyBlogs/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   └── blogs/
│   │   │       ├── blogSlice.js
│   │   │       └── blogService.js
│   │   │
│   │   ├── pages/
│   │   │   ├── CreatePost.jsx
│   │   │   ├── DashboardFeed.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── SinglePage.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── blogController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Blog.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── blogRoutes.js
│   │
│   ├── server.js
│   └── package.json
│
└── README.md
⚡ Getting Started

Follow these steps to run the project locally.

✅ Prerequisites

Make sure you have installed:

node -v
npm -v

You also need:

MongoDB Atlas account
Vercel account
Render account
📥 Clone The Repository
git clone https://github.com/your-username/myblogs.git
cd myblogs
🖥️ Frontend Setup
cd client
npm install
npm run dev

Frontend will run on:

http://localhost:5173
🔧 Backend Setup
cd server
npm install
npm run dev

Backend will run on:

http://localhost:5000
🔐 Environment Variables

Create a .env file inside the server folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development

For production, add these variables in Render dashboard:

PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=https://your-vercel-frontend.vercel.app
NODE_ENV=production
🌐 Frontend Environment

Create a .env file inside the client folder:

VITE_API_URL=http://localhost:5000

For Vercel production:

VITE_API_URL=https://your-render-backend.onrender.com
🔗 API Endpoints
Auth Routes
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
Blog Routes
GET    /api/blogs
GET    /api/blogs/:id
POST   /api/blogs
PUT    /api/blogs/:id
DELETE /api/blogs/:id
GET    /api/blogs/my-blogs
🧠 App Flow
User Register / Login
        ↓
JWT Token Generated
        ↓
User Creates Blog
        ↓
Blog Saved in MongoDB
        ↓
Blogs Show in Feed / Explore
        ↓
User Can Read, Edit, Delete Own Blogs
🖼️ Screenshots

Add your screenshots here:

![Home Page](./screenshots/home.png)
![Login Page](./screenshots/login.png)
![Dashboard](./screenshots/dashboard.png)
![Create Post](./screenshots/create-post.png)
🚀 Deployment Guide
Frontend Deployment — Vercel
Push frontend code to GitHub
Connect repository with Vercel
Add environment variable:
VITE_API_URL=https://your-render-backend.onrender.com
Deploy
Backend Deployment — Render
Push backend code to GitHub
Create new Web Service on Render
Add environment variables
Use:
Build Command: npm install
Start Command: npm start
🧪 Testing Checklist

Before production deployment, test:

Register user
Login user
Create blog
View all blogs
View single blog
Edit blog
Delete blog
Refresh page after login
Protected routes
Frontend + backend connection
Production API URL
📈 Future Improvements
Google login
GitHub login
Blog likes
Blog comments
User profile page
Blog categories
Search functionality
Rich text editor
Image upload with Cloudinary
Admin dashboard
Dark mode
🤝 Contributing

Contributions are welcome.

To contribute:

fork this repository
create a new branch
make your changes
open a pull request
📜 License

This project is licensed under the MIT License.

👨‍💻 Author

Amit Bhallavi

GitHub: @amitbhallavi
LinkedIn: Amit Bhallavi
<div align="center">
⭐ If you like this project, give it a star on GitHub!

Made with ❤️ by Amit Bhallavi

</div> ``` ::contentReference[oaicite:1]{index=1}
