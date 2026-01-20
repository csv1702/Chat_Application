import { useEffect, useState } from "react";
import api from "../services/api";

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await api.get("/auth/users");
      setUsers(res.data);
    };

    fetchUsers();
  }, []);

  return (
    <div className="h-full bg-white border-r">
      <div className="p-4 border-b font-semibold">
        Select User
      </div>

      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => onSelectUser(user)}
          className="p-4 cursor-pointer hover:bg-gray-100 border-b"
        >
          <p className="font-medium">{user.username}</p>
          <p className="text-xs text-gray-500">
            {user.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      ))}

      {users.length === 0 && (
        <p className="p-4 text-sm text-gray-500">
          No users found
        </p>
      )}
    </div>
  );
};

export default UserList;
