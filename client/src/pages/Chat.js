import ChatLayout from "../components/ChatLayout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { disconnectSocket } from "../socket/socket";

const Chat = () => {
  const { user, setUser } = useAuth();

  const logout = async () => {
    await api.post("/auth/logout");
    disconnectSocket();
    setUser(null);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="p-3 border-b flex justify-between items-center">
        <span className="font-medium">
          Logged in as {user.username}
        </span>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex-1">
        <ChatLayout />
      </div>
    </div>
  );
};

export default Chat;
