import React from 'react'
import styles from './Main/styles.module.css'
import { Link } from 'react-router-dom';

const ServerNav = () => {
    const handleLogout = () => {
      
          localStorage.removeItem("token");
          window.location.reload();
       
     
    }
  return (
    <div> <nav className={styles.navbar}>
   <Link to='/admindashboard'> <h1>Dashboard</h1></Link>
<button className={styles.white_btn} onClick={handleLogout}>
    Logout
</button>
    </nav></div>
  )
}

export default ServerNav