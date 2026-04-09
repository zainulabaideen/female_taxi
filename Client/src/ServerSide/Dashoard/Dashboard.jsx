import React, { useState } from 'react'
import { SideNavbar } from './Navbar/SideNavbar';
import DashboardNav from './Navbar/DashboardNav'
import Cookies from 'js-cookie';

const Dashboard = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  const title = Cookies.get('dashboardTitle');
  return (
    <>
      <DashboardNav onToggleSidebar={toggleSidebar} />
      <div className="absolute top-0 left-0 ">
        {sidebarVisible && (
          <div className='z-[17000] absolute top-0'>
            <SideNavbar onToggleSidebar={toggleSidebar} />
          </div>
        )}
      </div>
      <div className={`py-7 px-2 lg:p-7 bg-[#f2f2f2]  min-h-[100vh] rubik`}>
        <div className={` ${sidebarVisible ? ' mx-2 md:mx-6' : ''}`}>
          {/* <h1 className="text-[30px] drop-shadow-md font-semibold text-center my-10">{title}</h1> */}


          {
          title==="Orders" ? <h1 className="text-3xl font-semibold text-center mt-20">Welcome to Orders Dashboard</h1>
          :
          <h1 className="text-3xl font-semibold text-center mt-20">Welcome to Admin Dashboard</h1>
          }

        </div>
      </div>
    </>
  )
}

export default Dashboard