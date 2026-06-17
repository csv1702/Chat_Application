import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../store/authStore";
import { queryClient } from "../lib/queryClient";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  AlignLeft,
  Phone,
  Calendar,
  Shield,
  Camera,
  Edit2,
  Check,
  X,
  Info,
  Activity
} from "lucide-react";

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, setUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isOwnProfile = !userId || userId === currentUser?._id;

  /* ---------- FETCH PROFILE ---------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const url = isOwnProfile
          ? "/users/profile"
          : `/users/profile/${userId}`;
        const res = await api.get(url);
        setProfile(res.data);
        setFormData({
          username: res.data.username || "",
          bio: res.data.bio || "",
          phone: res.data.phone || "",
        });
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, isOwnProfile]);

  /* ---------- HANDLE INPUT CHANGE ---------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------- HANDLE PROFILE UPDATE ---------- */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");

      const res = await api.put("/users/profile", formData);
      setProfile(res.data.user);
      setUser(res.data.user);
      queryClient.setQueryData(["auth", "me"], res.data.user);
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  /* ---------- HANDLE AVATAR UPDATE ---------- */
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setError("");
        const res = await api.put("/users/avatar", {
          avatar: reader.result,
        });
        setProfile(res.data.user);
        setUser(res.data.user);
        queryClient.setQueryData(["auth", "me"], res.data.user);
        setSuccess("Avatar updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError("Failed to update avatar");
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <Card className="max-w-md w-full border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur text-center p-6 space-y-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
            <X className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Profile Not Found</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              The user profile you are trying to view does not exist or has been deactivated.
            </p>
          </div>
          <Button onClick={() => navigate("/")} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Back to Chat
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30 p-4 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Chat
        </Button>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Notifications */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-destructive/15 border border-destructive/30 text-destructive-foreground rounded-lg text-sm font-medium"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-medium"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card Frame */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur shadow-xl overflow-hidden">
            {/* Background cover effect */}
            <div className="h-32 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 relative" />

            <div className="px-6 pb-6 relative">
              {/* Avatar section overlapping the banner */}
              <div className="flex flex-col items-center -mt-16 mb-6">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-slate-50 dark:border-slate-900 shadow-xl bg-white dark:bg-slate-800">
                    <AvatarImage src={profile.avatar} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-4xl font-bold">
                      {profile.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Avatar Upload Overlay */}
                  {isOwnProfile && isEditing && (
                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition duration-200 text-white">
                      <Camera className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-semibold">Change Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="text-center mt-3">
                  <h2 className="text-2xl font-bold">{profile.username}</h2>
                  <div className="flex items-center gap-2 justify-center mt-1 text-slate-500 dark:text-slate-400 text-sm">
                    <span className={`w-2 h-2 rounded-full ${profile.isOnline ? "bg-green-500 animate-pulse" : "bg-slate-400"}`} />
                    {profile.isOnline ? "Online" : "Offline"}
                  </div>
                </div>
              </div>

              {/* Form or View Section */}
              {!isEditing ? (
                <div className="space-y-4">
                  {/* Username info */}
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/40">
                    <User className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Username</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{profile.username}</p>
                    </div>
                  </div>

                  {/* Email info */}
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/40">
                    <Mail className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Email Address</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{profile.email}</p>
                    </div>
                  </div>

                  {/* Bio info */}
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/40">
                    <AlignLeft className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Bio</span>
                      <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-line leading-relaxed">
                        {profile.bio || "No bio description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Phone info */}
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/40">
                    <Phone className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Phone Number</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {profile.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Status / Activity info */}
                  {!profile.isOnline && profile.lastSeen && (
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/40">
                      <Calendar className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Last Seen</span>
                        <p className="text-slate-700 dark:text-slate-300 text-sm">
                          {new Date(profile.lastSeen).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  {isOwnProfile && (
                    <div className="pt-4 flex justify-end">
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2 shadow-md"
                      >
                        <Edit2 className="w-4 h-4" /> Edit Profile
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                /* Edit Form */
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <Input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="pl-10 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bio</label>
                    <div className="relative">
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself..."
                        rows="3"
                        className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2 pt-4 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          username: profile.username || "",
                          bio: profile.bio || "",
                          phone: profile.phone || "",
                        });
                      }}
                      className="gap-2 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </Button>
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold shadow-md">
                      <Check className="w-4 h-4" /> Save Changes
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
