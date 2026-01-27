# Twitter (X) Clone 🐦

A full-stack **Twitter (X) clone** built to simulate real-world social media functionality using the **MERN stack**.  
This project focuses on authentication, core social features, real-time notifications, and scalable frontend architecture.

---

## 🚀 Features

### Core Functionality
- User authentication (Signup, Login, Logout)
- Protected routes using JWT
- Create, like, comment, and delete posts
- Follow and unfollow users
- Search users and visit public profiles
- Update user profile information
- Delete notifications

### Real-Time
- **Real-time notifications** for:
  - Likes
  - Comments
  - Follows  
  (Implemented using Socket.IO)

### UI & Product Features
- Responsive and animated UI
- Right-side panel for **random user recommendations**
- Profile pages with user-specific posts
- Clean and reusable component-based design

### Media
- Image uploads handled using **Cloudinary**

---

## 🛠 Tech Stack

### Frontend
- React.js (Vite)
- React Router
- TanStack React Query
- Tailwind CSS
- DaisyUI
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Socket.IO
- bcrypt (password hashing)
- Cloudinary (media uploads)

### Tools
- Git & GitHub
- REST APIs

---

## 🔐 Authentication & Security

- Passwords are securely hashed using **bcrypt**
- JWT tokens are generated on authentication
- Protected routes restrict access to authorized users
- Cookies are used for secure session handling

---

## 🔔 Real-Time Notifications

Real-time notifications are implemented using **Socket.IO** to provide instant updates for:
- Post likes
- Comments
- New followers

This ensures a smooth user experience without page refresh.

---

## ⚙️ API & State Management

- RESTful APIs built with Express.js
- MongoDB used for persistent data storage
- **TanStack React Query** is used on the frontend for:
  - Data fetching
  - Caching
  - Synchronization
  - Loading and error state management

---

## 🎨 UI & UX

- Fully responsive design using **Tailwind CSS**
- Component styling with **DaisyUI**
- Smooth animations using **Framer Motion**
- Client-side routing with **React Router**
- Scalable and reusable UI components

---

## 🧪 Purpose of the Project

This project was built as a **personal learning project** to:
- Strengthen React and frontend architecture skills
- Practice full-stack integration
- Implement real-time features
- Simulate real-world social media workflows

---

## 📌 Future Improvements

- Direct messaging between users
- Advanced search and filters
- Notification preferences
- Performance optimizations

---

## 👨‍💻 Author

**Aris Ansari**  
React Front-End Developer  

- GitHub: https://github.com/aris-ansari  
- LinkedIn: https://linkedin.com/in/aris-ansari

---

## 📄 License

This project is for educational purposes only.
