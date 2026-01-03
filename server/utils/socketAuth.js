const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const socketAuth = (socket) => {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = cookies.accessToken;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

module.exports = socketAuth;
