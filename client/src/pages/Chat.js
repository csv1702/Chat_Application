import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const { user, setUser } = useAuth();

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <div className="p-4">
      <p className="mb-4">Welcome, {user.username}</p>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2"
      >
        Logout
      </button>
    </div>
  );
};

export default Chat;
