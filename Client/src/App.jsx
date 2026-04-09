import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home/Home";
import WhatsAppLogo from "./Components/WhatsappLogo";
import { ToastContainer } from "react-toastify";


function App() {
  const user = localStorage.getItem("admintoken");
  const { pathname } = useLocation()

  const hideHeader = pathname === '/admindashboard' || pathname.startsWith("/admindashboard/");

  useEffect(() => {
    window.scroll(0, 0)
  }, [pathname])

  return (
    <>
      <WhatsAppLogo />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
     

      </Routes>
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App
