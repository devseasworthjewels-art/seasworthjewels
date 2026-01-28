import React from "react";
import whatsappIcon from "../assets/whatsapp-icon.png";

const WhatsAppIcon = ({ className = "", ...props }) => (
  <img
    src={whatsappIcon}
    alt="WhatsApp"
    className={`whatsapp-img-icon ${className}`}
    {...props}
  />
);

export default WhatsAppIcon;
