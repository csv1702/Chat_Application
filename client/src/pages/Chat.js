import ChatLayout from "../components/ChatLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { disconnectSocket } from "../socket/socket";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await api.post("/auth/logout");
    disconnectSocket();
    setUser(null);
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-950">
      <div className="p-3 border-b dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition"
          >
            Profile
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition"
          >
            Settings
          </button>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-1 rounded transition"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-950">
        <ChatLayout />
      </div>
    </div>
  );
};

export default Chat;
