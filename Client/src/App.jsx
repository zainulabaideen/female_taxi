import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
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

// Pages where Navbar/Footer should be hidden (dashboards + auth)
const hideLayoutPaths = [
  "/login",
  "/signup",
  "/role-select",
];

const isDashboard = (path) =>
  path.startsWith("/dashboard/");

function App() {
  const { pathname } = useLocation();

  const hideLayout =
    hideLayoutPaths.includes(pathname) || isDashboard(pathname);

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

        {/* Dashboards */}
        <Route path="/dashboard/driver/*" element={<DriverDashboard />} />
        <Route path="/dashboard/passenger/*" element={<PassengerDashboard />} />
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
