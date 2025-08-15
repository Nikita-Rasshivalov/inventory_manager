import { FaGoogle, FaGithub } from "react-icons/fa";
import { AuthService } from "../../services/authService";

const Socials = () => {
  return (
    <div className="flex gap-4 justify-center">
      <button
        type="button"
        onClick={AuthService.loginWithGoogle}
        className="flex items-center gap-2 px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 transition text-gray-700"
      >
        <FaGoogle />
        Google
      </button>
      <button
        type="button"
        onClick={AuthService.loginWithGitHub}
        className="flex items-center gap-2 px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 transition text-gray-700"
      >
        <FaGithub />
        GitHub
      </button>
    </div>
  );
};

export default Socials;
