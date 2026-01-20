import { useRef, useState } from "react";
import api from "../services/api";

const ImageUpload = ({ onUpload, activeChat }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeChat) return;

    setError("");
    setUploading(true);

    try {
      // Check file type - only images
      if (!file.type.startsWith("image/")) {
        setError("Only image files are supported");
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // Check file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError(`File too large (${(file.size / 1024 / 1024).toFixed(2)}MB > 5MB)`);
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onerror = () => {
        setError("Failed to read file");
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
      
      reader.onload = async () => {
        try {
          // Upload image
          const uploadRes = await api.post("/uploads/media", {
            chatId: typeof activeChat === 'string' ? activeChat : activeChat._id,
            content: `Shared image: ${file.name}`,
            attachments: [
              {
                url: reader.result,
                type: "image",
                filename: file.name,
                size: file.size,
              },
            ],
          });

          onUpload(uploadRes.data);
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (uploadErr) {
          console.error("Upload error:", uploadErr);
          setError(uploadErr.response?.data?.message || "Upload failed");
          setUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error("File select error:", err);
      setError("Failed to select file");
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        disabled={uploading || !activeChat}
        className="hidden"
        accept="image/*"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || !activeChat}
        className="text-xl hover:opacity-70 disabled:opacity-50 transition"
        title={uploading ? "Uploading..." : "Attach image"}
      >
        {uploading ? "⏳" : "🖼️"}
      </button>

      {error && (
        <div className="absolute top-full right-0 mt-2 bg-red-500 text-white text-xs p-2 rounded whitespace-nowrap z-50 max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
