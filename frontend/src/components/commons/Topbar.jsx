import React from "react";
import { useEffect, useState } from "react";
import { FaInstagram, FaMeta, FaXTwitter } from "react-icons/fa6";

const banner = {
  slogans: [
    "Elegance Woven In Every Thread",
    "Tradition Meets Trend",
    "Your Style, Our Kurtis",
  ],
};
const Topbar = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) =>
        prevIndex === banner.slogans.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#3e1104] p-3 px-5 flex justify-center md:justify-between items-center ">
      <div className=" hidden md:flex text-white text-xl  gap-2">
        <a href="">
          <FaMeta />
        </a>
        <a href="">
          <FaInstagram />
        </a>
        <a href="">
          <FaXTwitter />
        </a>
      </div>
      {/* solgon */}
      <div className=" aleo   text-xl font-semibold text-white transition-opacity duration-500 ease-in-out">
        {banner.slogans[index]}
      </div>
      {/* contact */}
      <div className="text-white hidden md:flex text-lg aleo">
        <a href="tel:+917400356434">+91-7400356434</a>
      </div>
    </div>
  );
};

export default Topbar;
