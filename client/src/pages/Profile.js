import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

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

    // For now, just use a data URL. In production, upload to Cloudinary/S3
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await api.put("/users/avatar", {
          avatar: reader.result,
        });
        setProfile(res.data.user);
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-red-500 dark:text-red-400 mb-4">Profile not found</p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Back to Chat
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition"
        >
          ← Back to Chat
        </button>
      </div>

      {/* Profile Container */}
      <div className="max-w-2xl mx-auto p-6">
        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg">
            {success}
          </div>
        )}

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 border-4 bg-blue-100 dark:bg-gray-700 border-blue-200 dark:border-gray-600">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-blue-600">
                {profile.username?.[0]?.toUpperCase()}
              </span>
            )}
          </div>

          {isOwnProfile && isEditing && (
            <label className="cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition">
              Change Avatar
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Profile Info */}
        {!isEditing ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Username</label>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{profile.username}</p>
            </div>

            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Email</label>
              <p className="text-gray-700 dark:text-gray-300">{profile.email}</p>
            </div>

            {profile.bio && (
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Bio</label>
                <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
              </div>
            )}

            {profile.phone && (
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Phone</label>
                <p className="text-gray-700 dark:text-gray-300">{profile.phone}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Status</label>
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span
                  className={`w-2 h-2 rounded-full ${
                    profile.isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
                {profile.isOnline ? "Online" : "Offline"}
              </p>
            </div>

            {profile.lastSeen && !profile.isOnline && (
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">Last Seen</label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(profile.lastSeen).toLocaleString()}
                </p>
              </div>
            )}

            {isOwnProfile && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105"
              >
                ✍️ Edit Profile
              </button>
            )}
          </div>
        ) : (
          /* Edit Form */
          <form
            onSubmit={handleUpdateProfile}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md"
          >
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                rows="3"
                className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105"
              >
                ✓️ Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                ✗ Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
