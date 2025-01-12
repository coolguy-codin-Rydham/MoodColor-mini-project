import { useState } from "react";
import { Lock, User } from "lucide-react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import {toast} from "react-toastify"
import PropTypes from "prop-types"
import "react-toastify/dist/ReactToastify.css";


const schema = Yup.object({
  username: Yup.string()
    .required("Username is Required")
    .min(3, "Username must be at least 3 characters"),
  password: Yup.string().required("Password is required"),
}).required();
const Login = ({setUser}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/admin-login",
        { username: data.username, password: data.password },
        { withCredentials: true }
      );
      console.log("Logged in");
      toast("Login Successful....", {
        autoClose: 2500
      })
      setTimeout(()=>{
          setUser(response.data.admin)
      }, 3000)
    } catch (error) {
      console.error("Login failed", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-200 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-600">
            Enter your credentials to access the dashboard
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Username"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                {...register("username")}
              />
              {errors.username && <p>{errors.username.message}</p>}
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                {...register("password")}
              />
              {errors.password && <p>{errors.password.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium
              ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              } transition-colors`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

Login.propTypes = {
  setUser: PropTypes.func.isRequired, // Define `setUser` as a required function
};


export default Login;
