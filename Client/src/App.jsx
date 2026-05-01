import { useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import Login from "./Pages/Auth/Login";
import SignUp from "./Pages/Auth/SignUp";
import RoleSelect from "./Pages/RoleSelect/RoleSelect";
import DriverDashboard from "./Pages/Dashboard/Driver/DriverDashboard";
import PassengerDashboard from "./Pages/Dashboard/Passenger/PassengerDashboard";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/AuthContext";

// Admin pages
import AdminLogin from "./ServerSide/AdminLogin/index";
import AdminDashboard from "./ServerSide/Dashoard/Dashboard";

// Pages where Navbar/Footer should be hidden
const hideLayoutPaths = ["/login", "/signup", "/role-select", "/admin/login"];
const isDashboard = (path) =>
  path.startsWith("/dashboard/") || path.startsWith("/admin/");

// Protected Route for users (driver/passenger)
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#402763] border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'driver' ? '/dashboard/driver' : '/dashboard/passenger'} replace />;
  }
  return children;
};

// Protected Route for admin
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('admintoken');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

function App() {
  const { pathname } = useLocation();
  const hideLayout = hideLayoutPaths.includes(pathname) || isDashboard(pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/role-select" element={<RoleSelect />} />

        {/* Driver Dashboard */}
        <Route
          path="/dashboard/driver/*"
          element={
            <ProtectedRoute allowedRole="driver">
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        {/* Passenger Dashboard */}
        <Route
          path="/dashboard/passenger/*"
          element={
            <ProtectedRoute allowedRole="passenger">
              <PassengerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>

      {!hideLayout && <Footer />}

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        toastStyle={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}
      />
    </>
  );
}

export default App;
