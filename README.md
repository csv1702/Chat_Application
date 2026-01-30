# Real-Time Chat Application

A full-stack real-time chat web application designed to provide fast, secure, and seamless communication between users. This project is built using modern web technologies and follows a clean, scalable architecture for both frontend and backend development.

## Live Application

**Live Website:** [https://real-time-chatting-web-service.netlify.app/](https://real-time-chatting-web-service.netlify.app/)

The frontend is deployed on Netlify and communicates with a separately hosted backend server using REST APIs and WebSocket connections.

---

## Project Overview

This project focuses on implementing real-time communication using web sockets while maintaining secure user authentication and an intuitive user interface. It demonstrates practical usage of the **MERN stack** along with **Socket.IO** to handle live messaging efficiently.

The application allows users to create accounts, log in securely, update their profiles, and exchange messages instantly without refreshing the page.

---

## Key Features

- **Secure Authentication**: JSON Web Tokens (JWT) & encrypted password storage with bcrypt.
- **Real-Time Messaging**: One-to-one messaging powered by Socket.IO.
- **Live Status**: Online/offline user connection handling.
- **User Profiles**: Profile creation and image upload capabilities.
- **Responsive UI**: Clean interface optimized for different screen sizes.
- **Robust Backend**: RESTful API structure with proper error handling.

---

## Technologies Used

### Frontend

- React.js
- React Router DOM
- Axios
- Socket.IO Client
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB & Mongoose
- Socket.IO
- JWT Authentication
- Multer & Cloudinary
- bcrypt
- dotenv

---

## Folder Structure

```text
Chat_Application/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── socket/
│       └── App.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── utils/
│   └── server.js
│
└── README.md
```

## Environment Configuration

Create `.env` files in your **server** and **client** directories with the following variables:

### Backend (`server/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`client/.env`)

```env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

````

---

##  Local Setup Instructions

Follow these steps to run the project locally.

### Step 1: Clone the Repository

```bash
git clone https://github.com/csv1702/Chat_Application.git
cd Chat_Application
````

### Step 2: Backend Setup

```bash
cd server
npm install
npm run dev
```

### Step 3: Frontend Setup

Open a new terminal window:

```bash
cd client
npm install
npm start
```

Once both servers are running, the application can be accessed locally at:
**[http://localhost:3000](http://localhost:3000)**

---

## Real-Time Communication Workflow

- The client establishes a socket connection immediately after user authentication.
- The server tracks active users and maps them to socket sessions.
- Messages are transmitted instantly using Socket.IO events (`send-msg`, `msg-recieve`).
- Connections are updated automatically on user disconnect or logout.

---

## Deployment Details

- **Frontend:** Hosted on Netlify using a production React build.
- **Backend:** Can be deployed on platforms such as Render, Railway, or AWS.
- **Database:** MongoDB Atlas (cloud-based).
- **Media Storage:** Cloudinary (for profile image uploads).

---

## Possible Improvements

- [ ] File and media sharing in chats
- [ ] Push notifications
- [ ] End-to-end message encryption

---

## 👨 Author

Chandra Shekhar Verma

---
