import { useEffect, useState, memo, useMemo } from "react";
import api from "../services/api";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserPlus, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UserItem = memo(({ user, onSelectUser }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    whileHover={{ scale: 1.01 }}
    onClick={() => onSelectUser(user)}
    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800/50"
  >
    <div className="relative">
      <Avatar className="w-10 h-10 border border-slate-200 dark:border-slate-850">
        <AvatarImage src={user.avatar} className="object-cover" />
        <AvatarFallback className="bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-semibold">
          {user.username?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${user.isOnline ? "bg-green-500" : "bg-slate-400"}`} />
    </div>

    <div className="flex-1 min-w-0">
      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{user.username}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {user.isOnline ? "Active now" : "Offline"}
      </p>
    </div>

    <div className="text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity">
      <UserPlus className="w-4 h-4" />
    </div>
  </motion.div>
));

UserItem.displayName = "UserItem";

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  return (
    <div className="flex flex-col gap-4 max-h-[450px]">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <Input
          type="text"
          placeholder="Search people by username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white"
        />
      </div>

      {/* Users Area */}
      <ScrollArea className="h-[350px] pr-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-2">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Loading contacts...</p>
          </div>
        ) : (
          <div className="space-y-1">
            <AnimatePresence initial={false}>
              {filteredUsers.map((user) => (
                <UserItem
                  key={user._id}
                  user={user}
                  onSelectUser={onSelectUser}
                />
              ))}
            </AnimatePresence>

            {!loading && filteredUsers.length === 0 && (
              <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                <p className="text-sm">No contacts found</p>
                <p className="text-xs mt-1">Try another search query</p>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default memo(UserList);

