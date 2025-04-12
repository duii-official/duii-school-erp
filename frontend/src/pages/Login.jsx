import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaLock } from "react-icons/fa";
import { IoEye, IoEyeOff } from "react-icons/io5";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log("Login Response:", data); // ✅ Console me check kar
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      // ✅ Save token & role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
  
      // ✅ Success Toast
      toast.success("✅ Login Successful!", {
        position: "top-center",
        autoClose: 2000,
      });
  
      // ✅ Redirect after 2 sec
      setTimeout(() => {
        if (data.role === "admin") {
          navigate("/adminpanel");
        } else if (data.role === "teacher") {
          navigate("/teacherspanel");
        } else {
          navigate("/");
        }
      }, 2000);
    } catch (err) {
      console.error("Login Error:", err.message);
      toast.error(`❌ ${err.message}`, { position: "top-center" });
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen ">
      <ToastContainer /> {/* ✅ Toast Container for Notifications */}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg w-96 shadow-gray-500 shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Login</h2>

        <div className="relative mb-4">
          <FaUser className="absolute left-3 top-4 text-gray-500" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 pl-10 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative mb-4">
          <FaLock className="absolute left-3 top-4 text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0.5 top-1.5 text-gray-500 focus:outline-none bg-white"
          >
            {showPassword ? <IoEye /> : <IoEyeOff />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition-all"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
