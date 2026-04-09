import React from "react";
import { Link } from "react-router-dom";

import { FaBars } from "react-icons/fa";

const DashboardNav = ({ onToggleSidebar }) => {
const Logo = `/logo.png`

  // const handleLinkClick = () => {
  //   scroll.scrollToTop();
  // };
  return (
    <>    
    <div className="rubik z-[10000] sticky top-0 bg-white shadow-lg  text-[#454545] h-24 Georgian  flex items-center w-full ">
      <div className="h-20 flex justify-between items-center md:px-7 p-4  w-full ">
        <div className="mx-[-18px] md:mx-[-12px]">
         <Link to={"/"}>
          <img src="/assets/logo.png" alt="logo" className="w-50 md:w-60" />
        </Link>
        </div>
        <div className="cursor-pointer hover:text-orange-600 duration-200 transition-all ease-out" onClick={onToggleSidebar}>
          <FaBars size={27} />
        </div>
      </div>
    </div>
    </>
  );
};

export default DashboardNav;
