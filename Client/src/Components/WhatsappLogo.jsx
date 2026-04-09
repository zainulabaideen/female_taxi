import React from "react";
import "./Ws.css"; 
import { BsWhatsapp } from "react-icons/bs";

const WhatsAppLogo = () => {
  const phoneNumber = "+9299999999"; 
  const message = "Hello, I have a question!"; 

  const generateWhatsAppLink = () => {
    return `https://wa.me/${phoneNumber}/?text=${encodeURIComponent(message)}`;
  };

  return (
    <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer">
      <div className="whatsapp-container">
        <BsWhatsapp className="whatsapp-icon" />
        <span className="notification-badge">1</span>
      </div>
    </a>
  );
};

export default WhatsAppLogo;
