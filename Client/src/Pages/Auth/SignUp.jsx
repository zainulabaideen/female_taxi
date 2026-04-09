import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../store/user";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.user);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signUp(formData));
    if (signUp.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
      <section className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-semibold text-center">Create a new account</h1>

        <p className="text-sm text-center text-gray-500 mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Password (min 8 chars)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default SignUp;