# Twitter (X) Clone 🐦

A full-stack **Twitter (X) clone** built to practice real-world frontend and backend development using the **MERN stack**.  
The project focuses on authentication, real-time notifications, scalable UI, and efficient data handling.

---

## 🚀 Features

- User authentication (Signup, Login, Logout)
- Protected routes using JWT
- Create and interact with posts
- Like, comment, and follow functionality
- **Real-time notifications** for likes, comments, and follows
- Responsive and animated UI
- Media uploads with Cloudinary
- Scalable API and reusable UI components

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

## 📂 Project Structure

twitter-clone/
│
├── frontend/ # React frontend (Vite)
│ ├── src/
│ ├── components/
│ ├── pages/
│ └── services/
│
├── backend/ # Express backend
│ ├── src/
│ ├── routes/
│ ├── controllers/
│ └── models/
│
└── README.md

---

## 🔐 Authentication Flow

- User credentials are securely hashed using **bcrypt**
- JWT tokens are generated on login
- Protected routes ensure authorized access
- Cookies are used for session handling

---

## 🔔 Real-Time Notifications

Real-time notifications are implemented using **Socket.IO**:
- Like notifications
- Comment notifications
- Follow notifications

This enables instant updates without page refresh.

---

## ⚙️ API & State Management

- RESTful APIs built with Express.js
- MongoDB used for data persistence
- **TanStack React Query** handles:
  - Data fetching
  - Caching
  - Synchronization
  - Loading and error states

---

## 🎨 UI & UX

- Fully responsive design using **Tailwind CSS**
- Pre-built and custom components using **DaisyUI**
- Smooth animations with **Framer Motion**
- Clean, reusable component-based architecture

---

## 🧪 Purpose of the Project

This project was built as a **personal learning project** to:
- Strengthen React fundamentals
- Understand frontend–backend integration
- Work with real-time features
- Simulate real-world social media workflows

---

## 📌 Future Improvements

- Direct messaging
- Tweet bookmarking
- User profile customization
- Advanced notification preferences

---

## 👨‍💻 Author

**Aris Ansari**  
React Front-End Developer  

- GitHub: https://github.com/aris-ansari  
- LinkedIn: https://linkedin.com/in/aris-ansari

---

## 📄 License

This project is for educational purposes only.
