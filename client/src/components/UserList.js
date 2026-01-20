import { useEffect, useState, memo, useMemo } from "react";
import api from "../services/api";

const UserItem = memo(({ user, onSelectUser }) => (
  <div
    key={user._id}
    onClick={() => onSelectUser(user)}
    className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 border-b dark:border-gray-700"
  >
    <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400">
      {user.isOnline ? "Online" : "Offline"}
    </p>
  </div>
));

UserItem.displayName = "UserItem";

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/users?limit=100");
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const memoizedUsers = useMemo(() => users, [users]);

  return (
    <div className="h-full bg-white dark:bg-gray-950 border-r dark:border-gray-700">
      <div className="p-4 border-b dark:border-gray-700 font-semibold text-gray-900 dark:text-white">
        Select User ({memoizedUsers.length})
      </div>

      {loading ? (
        <p className="p-4 text-sm text-gray-500 dark:text-gray-400">Loading users...</p>
      ) : (
        <>
          {memoizedUsers.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              onSelectUser={onSelectUser}
            />
          ))}

          {memoizedUsers.length === 0 && (
            <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
              No users found
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default memo(UserList);
