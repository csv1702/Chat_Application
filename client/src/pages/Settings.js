import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleTheme } = useTheme();

  const [notificationSettings, setNotificationSettings] = useState({
    soundEnabled: localStorage.getItem("soundNotifications") !== "false",
    desktopEnabled: localStorage.getItem("desktopNotifications") !== "false",
    messagePreview: localStorage.getItem("messagePreview") !== "false",
  });

  const [privacySettings, setPrivacySettings] = useState({
    showOnlineStatus: localStorage.getItem("showOnlineStatus") !== "false",
    allowAddByStrangers: localStorage.getItem("allowAddByStrangers") === "true",
    readReceipts: localStorage.getItem("readReceipts") !== "false",
  });

  const [generalSettings, setGeneralSettings] = useState({
    autoStartChat: localStorage.getItem("autoStartChat") === "true",
    compactMode: localStorage.getItem("compactMode") === "true",
  });

  /* ---------- SAVE NOTIFICATION SETTINGS ---------- */
  const handleNotificationChange = (key) => {
    const newSettings = {
      ...notificationSettings,
      [key]: !notificationSettings[key],
    };
    setNotificationSettings(newSettings);
    localStorage.setItem(key, newSettings[key]);
  };

  /* ---------- SAVE PRIVACY SETTINGS ---------- */
  const handlePrivacyChange = (key) => {
    const newSettings = {
      ...privacySettings,
      [key]: !privacySettings[key],
    };
    setPrivacySettings(newSettings);
    localStorage.setItem(key, newSettings[key]);
  };

  /* ---------- SAVE GENERAL SETTINGS ---------- */
  const handleGeneralChange = (key) => {
    const newSettings = {
      ...generalSettings,
      [key]: !generalSettings[key],
    };
    setGeneralSettings(newSettings);
    localStorage.setItem(key, newSettings[key]);
  };

  /* ---------- CLEAR CACHE ---------- */
  const handleClearCache = () => {
    if (window.confirm("Are you sure? This will clear all cached messages.")) {
      localStorage.removeItem("chatMessages");
      alert("Cache cleared successfully");
    }
  };

  /* ---------- EXPORT DATA ---------- */
  const handleExportData = () => {
    const userData = {
      user: user,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chat-app-data-${Date.now()}.json`;
    link.click();
  };

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

      {/* Settings Container */}
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Settings</h1>

        {/* GENERAL SETTINGS */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2 text-gray-900 dark:text-white">General</h2>

          {/* Dark Mode */}
          <div className="mb-4 flex justify-between items-center">
            <div>
              <label className="font-semibold text-gray-900 dark:text-white">Dark Mode</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Toggle light and dark theme
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
            >
              🌙 Toggle
            </button>
          </div>

          {/* Compact Mode */}
          <div className="mb-4 flex justify-between items-center">
            <div>
              <label className="font-semibold text-gray-900 dark:text-white">Compact Mode</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Reduce spacing and font sizes
              </p>
            </div>
            <input
              type="checkbox"
              checked={generalSettings.compactMode}
              onChange={() => handleGeneralChange("compactMode")}
              className="w-5 h-5 cursor-pointer accent-blue-600"
            />
          </div>

          {/* Auto Start Chat */}
          <div className="flex justify-between items-center">
            <div>
              <label className="font-semibold text-gray-900 dark:text-white">Auto-Start Chat</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Open last chat on login
              </p>
            </div>
            <input
              type="checkbox"
              checked={generalSettings.autoStartChat}
              onChange={() => handleGeneralChange("autoStartChat")}
              className="w-5 h-5 cursor-pointer accent-blue-600"
            />
          </div>
        </section>

        {/* NOTIFICATION SETTINGS */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2 text-gray-900 dark:text-white">Notifications</h2>

          {/* Sound */}
          <div className="mb-4 flex justify-between items-center">
            <div>
              <label className="font-semibold text-gray-900 dark:text-white">Sound Notifications</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Play sound on new message
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.soundEnabled}
              onChange={() => handleNotificationChange("soundNotifications")}
              className="w-5 h-5 cursor-pointer accent-blue-600"
            />
          </div>

          {/* Desktop Notifications */}
          <div className="mb-4 flex justify-between items-center">
            <div>
              <label className="font-semibold text-gray-900 dark:text-white">Desktop Notifications</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Show browser notifications
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.desktopEnabled}
              onChange={() => handleNotificationChange("desktopNotifications")}
              className="w-5 h-5 cursor-pointer accent-blue-600"
            />
          </div>

          {/* Message Preview */}
          <div className="flex justify-between items-center">
            <div>
              <label className="font-semibold text-gray-900 dark:text-white">Message Preview</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Show message content in notifications
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.messagePreview}
              onChange={() => handleNotificationChange("messagePreview")}
              className="w-5 h-5 cursor-pointer accent-blue-600"
            />
          </div>
        </section>

        {/* PRIVACY SETTINGS */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2 text-gray-900 dark:text-white">Privacy</h2>

          {/* Online Status */}
          <div className="mb-4 flex justify-between items-center">
            <div>
              <label className="font-semibold text-gray-900 dark:text-white">Show Online Status</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Let others see if you're online
              </p>
            </div>
            <input
              type="checkbox"
              checked={privacySettings.showOnlineStatus}
              onChange={() => handlePrivacyChange("showOnlineStatus")}
              className="w-5 h-5 cursor-pointer accent-blue-600"
            />
          </div>

          {/* Read Receipts */}
          <div className="mb-4 flex justify-between items-center">
            <div>
              <label className="font-semibold text-gray-900 dark:text-white">Read Receipts</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Show when you've read messages
              </p>
            </div>
            <input
              type="checkbox"
              checked={privacySettings.readReceipts}
              onChange={() => handlePrivacyChange("readReceipts")}
              className="w-5 h-5 cursor-pointer accent-blue-600"
            />
          </div>

          {/* Allow Add by Strangers */}
          <div className="flex justify-between items-center">
            <div>
              <label className="font-semibold text-gray-900 dark:text-white">Allow Add by Strangers</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Let anyone start a chat with you
              </p>
            </div>
            <input
              type="checkbox"
              checked={privacySettings.allowAddByStrangers}
              onChange={() => handlePrivacyChange("allowAddByStrangers")}
              className="w-5 h-5 cursor-pointer accent-blue-600"
            />
          </div>
        </section>

        {/* DATA & STORAGE */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2 text-gray-900 dark:text-white">Data & Storage</h2>

          <div className="mb-4">
            <button
              onClick={handleClearCache}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105"
            >
              🗑️ Clear Cache
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Clear cached messages and data
            </p>
          </div>

          <div>
            <button
              onClick={handleExportData}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition transform hover:scale-105"
            >
              📥 Export Data
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Download your profile data as JSON
            </p>
          </div>
        </section>

        {/* ABOUT */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2 text-gray-900 dark:text-white">About</h2>
          <div className="mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">App Version: 1.0.0</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              © 2026 Chat App. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
