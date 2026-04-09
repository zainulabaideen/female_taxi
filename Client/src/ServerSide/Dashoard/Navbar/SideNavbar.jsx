import React, { useState } from 'react';
import { MdViewModule, MdAddAPhoto, MdPhotoLibrary, MdArrowBack, MdArrowForward, MdExitToApp, MdWork, MdManageAccounts, MdOutlineViewModule } from "react-icons/md";
import Cookies from 'js-cookie';
import { animateScroll as scroll } from 'react-scroll';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, GitPullRequestCreateArrow, MessageSquare } from 'lucide-react';

export const SideNavbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const logo = `/assets/logo.png`;
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
    onToggleSidebar();
    scroll.scrollToTop();
  };

  const handleLogout = () => {


    localStorage.removeItem("admintoken");
    window.location.reload();
    navigate('/');
  }


  const handleMenuItemClick = (title, onClick) => {
    if (onClick) {
      onClick();
    } else {
      Cookies.set('dashboardTitle', title, { expires: 1, path: '/' });
      toggleSidebar();
      // window.location.reload(); 
    }
  };


  const Menu = [
   
      {
      title: "Orders",
      icon: <MessageSquare />,
    },
    {
      title: "Logout",
      icon: <MdExitToApp />,
      spacing: true,
      onClick: handleLogout,
    },
  ];

  return (
    <div className={`rubik ${sidebarVisible ? 'w-72' : 'hidden'} pb-20 bg-white h-screen  fixed  shadow-xl duration-300 p-5 pt-8 `}>
      {/* Toggle Button */}
      <div className="text-white bg-white border border-dark-purple cursor-pointer text-2xl flex justify-center items-center rounded-full absolute -right-3 top-9 p-2" onClick={toggleSidebar}>
        {sidebarVisible ? <MdArrowBack className="text-[#99702B]" /> : <MdArrowForward className="text-primary" />}
      </div>

      {/* Logo */}
      <div className="inline-block">
        <span className="text-4xl flex justify-center items-center rounded cursor-pointer mr-2">
          <img src={logo} id="logosize" alt="Mba solutions" height="80px" />
        </span>
      </div>

      {/* Menu Items */}
      <ul className="mt-12 ml-3 text-black/80 h-[88%] overflow-y-auto">
        {Menu?.map((menuItem, index) => (
          <React.Fragment key={index}>
            {menuItem.spacing && <hr className="border-t border-gray-100 my-5" />}
            <li
              className="lightblack hover:underline ease-out transition-all duration-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md mt-2"
              onClick={() => handleMenuItemClick(menuItem.title, menuItem.onClick)}
            >
              <span className="text-2xl block float-left">{menuItem.icon}</span>
              <span className={`text-base font-medium flex-1 ${!sidebarVisible ? 'hidden' : ''}`}>{menuItem.title}</span>
            </li>
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};
