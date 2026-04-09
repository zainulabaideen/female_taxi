import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const AdminLogin = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const baseURL = import.meta.env.VITE_NODE_URL;

  // 🧠 Check token expiry on load
  useEffect(() => {
    const storedTokenData = JSON.parse(localStorage.getItem("admintokenData"));
    if (storedTokenData) {
      const now = Date.now();
      if (now >= storedTokenData.expiry) {
        localStorage.removeItem("admintokenData");
        localStorage.removeItem("admintoken");
        console.log("Admin token expired and removed automatically.");
      }
    }
  }, []);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = `${baseURL}/api/auth/admin/login`;
      const { data: res } = await axios.post(url, data);

      const token = res.admintoken;
      const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

      // 🧠 Store token and expiry
      localStorage.setItem("admintoken", token);
      localStorage.setItem(
        "admintokenData",
        JSON.stringify({ token, expiry })
      );

      window.location = "/admindashboard";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Admin Login
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center font-medium bg-red-50 py-2 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Want to go to{" "}
          <Link
            to="/"
            className="text-orange-500 font-semibold hover:underline"
          >
            Main Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
