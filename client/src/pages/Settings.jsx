import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useTheme } from "../store/themeStore";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Sun, Bell, Lock, Database, Info, Trash2, Download, ToggleLeft, ToggleRight } from "lucide-react";
import { motion } from "framer-motion";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

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

      {/* Settings Container */}
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-extrabold tracking-tight">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your account preferences, themes, and notification options</p>
        </motion.div>

        {/* GENERAL SETTINGS */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur shadow-md">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg">
              <Sun className="w-5 h-5 dark:hidden" />
              <Moon className="w-5 h-5 hidden dark:block" />
            </div>
            <div>
              <CardTitle className="text-lg">General Preferences</CardTitle>
              <CardDescription>Configure application appearance and launch preferences</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dark Mode */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Dark Interface</p>
                <p className="text-xs text-slate-500">Toggle dark and light colors</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="gap-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                {isDarkMode ? (
                  <>
                    <Moon className="w-4 h-4 text-indigo-400" /> Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-amber-500" /> Light Mode
                  </>
                )}
              </Button>
            </div>

            {/* Compact Mode */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Compact Sizing</p>
                <p className="text-xs text-slate-500">Minimize layout padding and spacing</p>
              </div>
              <button onClick={() => handleGeneralChange("compactMode")}>
                {generalSettings.compactMode ? (
                  <ToggleRight className="w-10 h-10 text-blue-500" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-slate-400" />
                )}
              </button>
            </div>

            {/* Auto Start Chat */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Auto-Start Chat</p>
                <p className="text-xs text-slate-500">Restore last active conversation on startup</p>
              </div>
              <button onClick={() => handleGeneralChange("autoStartChat")}>
                {generalSettings.autoStartChat ? (
                  <ToggleRight className="w-10 h-10 text-blue-500" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-slate-400" />
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* NOTIFICATION SETTINGS */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur shadow-md">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Notifications</CardTitle>
              <CardDescription>Choose how you receive message alerts</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sound */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Audio Alerts</p>
                <p className="text-xs text-slate-500">Play a notification sound on incoming messages</p>
              </div>
              <button onClick={() => handleNotificationChange("soundNotifications")}>
                {notificationSettings.soundEnabled ? (
                  <ToggleRight className="w-10 h-10 text-blue-500" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-slate-400" />
                )}
              </button>
            </div>

            {/* Desktop Notifications */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Desktop Notifications</p>
                <p className="text-xs text-slate-500">Display desktop push notifications</p>
              </div>
              <button onClick={() => handleNotificationChange("desktopNotifications")}>
                {notificationSettings.desktopEnabled ? (
                  <ToggleRight className="w-10 h-10 text-blue-500" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-slate-400" />
                )}
              </button>
            </div>

            {/* Message Preview */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Message Preview</p>
                <p className="text-xs text-slate-500">Show message snippets inside notification content</p>
              </div>
              <button onClick={() => handleNotificationChange("messagePreview")}>
                {notificationSettings.messagePreview ? (
                  <ToggleRight className="w-10 h-10 text-blue-500" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-slate-400" />
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* PRIVACY SETTINGS */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur shadow-md">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Privacy & Security</CardTitle>
              <CardDescription>Manage your network visibility and receipts</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Online Status */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Show Online Status</p>
                <p className="text-xs text-slate-500">Let other users see when you are active</p>
              </div>
              <button onClick={() => handlePrivacyChange("showOnlineStatus")}>
                {privacySettings.showOnlineStatus ? (
                  <ToggleRight className="w-10 h-10 text-blue-500" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-slate-400" />
                )}
              </button>
            </div>

            {/* Read Receipts */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Read Receipts</p>
                <p className="text-xs text-slate-500">Send double-checks when you read a message</p>
              </div>
              <button onClick={() => handlePrivacyChange("readReceipts")}>
                {privacySettings.readReceipts ? (
                  <ToggleRight className="w-10 h-10 text-blue-500" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-slate-400" />
                )}
              </button>
            </div>

            {/* Allow Add by Strangers */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Allow Add by Strangers</p>
                <p className="text-xs text-slate-500">Let users start conversations with you directly</p>
              </div>
              <button onClick={() => handlePrivacyChange("allowAddByStrangers")}>
                {privacySettings.allowAddByStrangers ? (
                  <ToggleRight className="w-10 h-10 text-blue-500" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-slate-400" />
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* DATA & STORAGE */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur shadow-md">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Storage & Data</CardTitle>
              <CardDescription>Export settings or free up client-side storage</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Clear Cache</p>
                <p className="text-xs text-slate-500">Wipe locally saved message logs</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearCache}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" /> Clear Cache
              </Button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Export Information</p>
                <p className="text-xs text-slate-500">Save a backup of your personal user logs (JSON)</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                className="gap-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <Download className="w-4 h-4" /> Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ABOUT */}
        <div className="text-center text-xs text-slate-400 flex flex-col gap-2 pt-4">
          <p className="flex items-center justify-center gap-1">
            <Info className="w-3.5 h-3.5" /> Version 1.0.0 • Client runs on Vite
          </p>
          <p>© 2026 Real-time Chat App. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
