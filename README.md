# Real-Time Chat Application

A full-stack real-time chat web application designed to provide fast, secure, and seamless communication between users. This project is built using modern web technologies and follows a clean, scalable architecture for both frontend and backend development.

## Live Application

**Live Website:** [https://real-time-chatting-web-service.netlify.app/](https://real-time-chatting-web-service.netlify.app/)

The frontend is deployed on Netlify and communicates with a separately hosted backend server using REST APIs and WebSocket connections.

---

## Key Features

- **Secure Authentication**: JSON Web Tokens (JWT) & encrypted password storage with bcrypt.
- **Real-Time Messaging**: One-to-one messaging powered by Socket.IO.
- **Live Status**: Online/offline user connection handling.
- **User Profiles**: Profile creation and image upload capabilities.
- **Responsive UI**: Clean interface optimized for different screen sizes.
- **Robust Backend**: RESTful API structure with proper error handling.

---

## Folder Structure

```text
Chat_Application/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── socket/
│       ├── store/
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
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

If you use MongoDB Atlas, make sure the cluster is reachable from your machine and the URI is correct.

### Frontend (`client/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🚀 Quick Start / How to Run

Follow these simple steps to run the application locally.

### 1. Start the Backend Server
In your first terminal window:
```bash
cd server
npm install
npm run dev
```

### 2. Start the Frontend Client (Vite)
In a second terminal window:
```bash
cd client
npm install
npm start
```

Once both are running, open your browser and navigate to:
**[http://localhost:3000](http://localhost:3000)**

---

## Real-Time Communication Workflow

- The client establishes a socket connection immediately after user authentication.
- The server tracks active users and maps them to socket sessions.
- Messages are transmitted instantly using Socket.IO events (`send_message`, `receive_message`).
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
