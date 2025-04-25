import React from "react";
import "../../styles/pagecomponentsstyles.css"; // 👈 same as GRow

interface GLogoProps {
  src: string;
  alt: string;
  width?: string;
  className?: string;
}

const GLogo: React.FC<GLogoProps> = ({ src, alt, width = "100px", className = "" }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`g-logo ${className}`} // 👈 add a class for styling
      style={{ width }}
    />
  );
};

export default GLogo;
