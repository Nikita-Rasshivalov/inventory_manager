import { useState, ChangeEvent } from "react";
import { useUserStore } from "../../stores/useUserStore";
import { useAuth } from "../../hooks/useAuth";
import { Camera, Upload } from "lucide-react";
import Button from "../../components/common/Button";
import { useAuthStore } from "../../stores/useAuthStore";

interface AvatarUploaderProps {
  currentUrl: string;
}

const AvatarUploader = ({ currentUrl }: AvatarUploaderProps) => {
  const { uploadProfilePhoto } = useUserStore();
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetInput = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;
    setLoading(true);
    try {
      const updatedUser = await uploadProfilePhoto(selectedFile);
      if (updatedUser) setUser(updatedUser); // обновляем локально
      resetInput();
    } catch (err) {
      console.error(err);
      resetInput();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-32 rounded-full overflow-hidden shadow-md mb-4">
        <img
          src={preview || currentUrl || "/default-avatar.png"}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="avatarInput"
        />
        <label
          htmlFor="avatarInput"
          className="cursor-pointer p-3 bg-gray-400 text-white rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center"
          title="Choose Photo"
        >
          <Camera className="w-5 h-5" />
        </label>

        {selectedFile && (
          <Button
            onClick={handleUpload}
            title="Upload"
            className={`p-3 rounded-full flex items-center justify-center transition-colors ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            disabled={loading}
          >
            <Upload className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AvatarUploader;
