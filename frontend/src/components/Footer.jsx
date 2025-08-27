import React from "react";
import Footerimage from "../assets/footer.webp";

const Footer = () => {
  return (
    <footer
      className=" aleo relative h-[400px] w-full bg-fixed bg-center bg-cover"
      style={{ backgroundImage: `url(${Footerimage})` }}
    >
      {/* Overlay to improve text visibility */}
      <div className="absolute aleo " />

      {/* Content */}
      <div className="relative h-full flex pt-20 flex-col items-center justify-center text-center px-4">
        <h2 className="text-[#580E0C] text-xl font-bold">Pehrin</h2>
        <p className="italic text-[#580E0C] mt-2">
          by two Paramitras... Sirf tumahre nakhro ke liye
        </p>

        {/* Socials */}
        <div className="flex gap-6 text-[#580E0C] text-2xl mt-4">
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noreferrer">
            <i className="fab fa-pinterest"></i>
          </a>
        </div>

        {/* Bottom copyright */}
        <p className="text-xs text-[#580E0C] pt-40 md:pt-50 ">
          © 2025, Pehrin Powered by Shopify · Privacy policy · Refund policy ·
          Terms of Service · Contact information
        </p>
      </div>
    </footer>
  );
};

export default Footer;
