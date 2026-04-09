import { Link } from "react-router-dom"; 
import { ChevronDown, UserRound, LogOut, User, Mail, Phone, Clock, Shield } from "lucide-react";
import { useState, useRef, useEffect } from "react"; 

const DashboardNav = ({ onToggleSidebar, isOpen }) => { 

  const [showStaffInfo, setShowStaffInfo] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowStaffInfo(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="rubik fixed top-0 left-0 right-0 bg-white shadow-md h-18 flex items-center z-40">
      <div className="flex items-center justify-between w-full px-4 md:px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Alpha Enterprises" className="h-15 object-contain" />
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-4">

          {/* Staff Dropdown */}
          {/* <article className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowStaffInfo(!showStaffInfo)}
              className="flex items-center gap-1"
            >
              <UserRound size={25} />
              <ChevronDown
                size={18}
                className={`transition ${showStaffInfo ? "rotate-180" : ""}`}
              />

            </button>

           
          </article> */}

          {/* Sidebar toggle */}

          <button
            onClick={onToggleSidebar}
            className="flex flex-col space-y-1 mr-2"
            title={`${isOpen ? "Close Sidebar" : "Open Sidebar"}`}
          >
            <span className={`w-7 h-1 bg-gray-800 rounded-3xl transition ${isOpen && "rotate-45 translate-y-2 "}`} />
            <span className={`w-7 h-1 bg-gray-800 rounded-3xl transition ${isOpen && "opacity-0"}`} />
            <span className={`w-7 h-1 bg-gray-800 rounded-3xl transition ${isOpen && "-rotate-45 -translate-y-2 "}`} />
          </button>


        </div>
      </div>
    </header>
  );
};

export default DashboardNav;
