import React from "react";
import Hero from "../../assets/bannervideo.mp4";

const Herosection = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video */}
      <video
        className="w-full h-full object-cover"
        muted
        autoPlay
        playsInline
        loop
        src={Hero}
      ></video>

      {/* Overlay */}
      {/* <div className="absolute top-0 left-0 h-full w-full bg-black/10 z-10" /> */}

      {/* Bottom-Centered Text */}
      <div className="absolute bottom-20  md:bottom-20 lg:bottom-24 w-full flex justify-center px-4">
        <h1 className="poppins text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold drop-shadow-md text-center max-w-4xl leading-tight">
          जो भी हो नखरे, हमारे हैं तुम्हारे लिए
        </h1>
      </div>
    </div>
  );
};

export default Herosection;
