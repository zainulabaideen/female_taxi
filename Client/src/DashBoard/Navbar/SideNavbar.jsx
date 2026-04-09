import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, ClipboardPlus, BarChart3, LogOut,
  Briefcase, Box, FileText, ListTodo, ListPlus, Handshake, BadgeCheck,
  QrCode, MonitorCog,
  FolderPlus,
  FolderOpen
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { logOut } from '../../store/user';
import { useDispatch } from 'react-redux';

const SideNavbar = ({ onToggleSidebar }) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setSidebarVisible((v) => !v);
    onToggleSidebar?.();
  };

  const menu = [
    { title: "Add Product", icon: <Plus />, href: "/admindashboard/add-product" },
    { title: "Manage Products", icon: <Box />, href: "/admindashboard/manage-products" },
    
    { title: "Add Project", icon: <FolderPlus />, href: "/admindashboard/add-project" },
    { title: "Manage Projects", icon: <FolderOpen />, href: "/admindashboard/manage-projects" },

    { title: "Add Category", icon: <ListPlus />, href: "/admindashboard/add-category", spacing: true },
    { title: "Manage Categories", icon: <ListTodo />, href: "/admindashboard/manage-categories" },
    { title: "Add Parent Category", icon: <FolderPlus/>, href: "/admindashboard/add-parent-category" },
    { title: "Manage Parent Categories", icon: <FolderOpen/>, href: "/admindashboard/manage-parent-categories" },


    { title: "Certifications", icon: <BadgeCheck />, href: "/admindashboard/certifications", spacing: true },
    { title: "Partners", icon: <Handshake />, href: "/admindashboard/partners" },

    { title: "Post Job", icon: <ClipboardPlus />, href: "/admindashboard/create-job", spacing: true },
    { title: "Manage Jobs", icon: <MonitorCog />, href: "/admindashboard/manage-jobs" },
    { title: "Job Applications", icon: <Briefcase />, href: "/admindashboard/job-applications" },

    { title: "Contact Forms", icon: <QrCode />, href: "/admindashboard/contact-forms", spacing: true },
    { title: "Reports & Analytics", icon: <BarChart3 />, href: "/admindashboard/reports-analytics" },
  ];

  return (
    <aside
      className={`rubik fixed top-0 left-0 z-[9000] bg-white shadow-xl flex flex-col
        transition-all duration-300 ${sidebarVisible ? "w-72" : "w-0 overflow-hidden"}`}
      style={{ height: "100dvh" }}
    >
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 bg-white border rounded-full p-1 shadow z-10"
      >
        {sidebarVisible
          ? <ChevronLeft className="text-[#99702B]" />
          : <ChevronRight className="text-[#99702B]" />
        }
      </button>

      {/* Logo — fixed at top */}
      <div className="flex justify-center py-6 flex-shrink-0 border-b border-gray-100">
        <img src="/logo.png" alt="Alpha Enterprises" className="h-14 object-contain" />
      </div>

      {/* Scrollable menu — takes remaining height */}
      <nav className="flex-1 overflow-y-auto px-4 py-3 text-sm text-gray-700">
        <ul className="space-y-0.5">
          {menu?.map((item, idx) => {
            const isActive = location.pathname === item.href;
            return (
              <React.Fragment key={idx}>
                {item.spacing && <hr className="my-3 border-gray-100" />}
                <li>
                  <Link
                    to={item.href}
                    onClick={toggleSidebar}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
                      ${isActive
                        ? "bg-orange-50 text-orange-600 font-semibold"
                        : "hover:bg-gray-100 text-gray-700"
                      }`}
                  >
                    <span className={`flex-shrink-0 ${isActive ? "text-orange-500" : "text-gray-500"}`}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.title}</span>
                  </Link>
                </li>
              </React.Fragment>
            );
          })}
        </ul>

        {/* Logout — at bottom of scroll area */}
        <hr className="my-3 border-gray-100" />
        <button
          onClick={() => dispatch(logOut())}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-500 hover:bg-red-50 transition-all duration-150"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default SideNavbar;