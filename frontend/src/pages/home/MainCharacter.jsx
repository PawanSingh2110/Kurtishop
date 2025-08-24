import React from "react";

const MainCharacter = () => {
  const videomain = [
    {
      video:
        "https://www.pehrin.com/cdn/shop/videos/c/vp/17ac1687e6d94ea3b62351f55d0be1f1/17ac1687e6d94ea3b62351f55d0be1f1.HD-1080p-7.2Mbps-49077462.mp4?v=0",
    },
    {
      video:
        "https://www.pehrin.com/cdn/shop/videos/c/vp/27362a30a557445c9c05d3fe6c43f4d7/27362a30a557445c9c05d3fe6c43f4d7.HD-1080p-7.2Mbps-49077463.mp4?v=0",
    },
    {
      video:
        "https://www.pehrin.com/cdn/shop/videos/c/vp/ed0190dcfbab4455b838c991d3dc68e0/ed0190dcfbab4455b838c991d3dc68e0.HD-1080p-7.2Mbps-49122535.mp4?v=0",
    },
    {
      video:
        "https://www.pehrin.com/cdn/shop/videos/c/vp/f9489107fa0244d394c9f600f4b7b1d3/f9489107fa0244d394c9f600f4b7b1d3.HD-1080p-7.2Mbps-49122536.mp4?v=0",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl md:text-4xl font-medium aleo text-center mb-6">
        Shop To Be The Main Character
      </h1>

      {/* ✅ Small screens: horizontal scroll (swipe) */}
      <div className="md:hidden flex gap-4 overflow-x-auto scrollbar-hidden">
        {videomain.map((item, index) => (
          <div key={index} className="min-w-[310px] aspect-[3/4] h-[520px]">
            <video
              src={item.video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* ✅ From md and up: grid layout */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
        {videomain.map((item, index) => (
          <div key={index} className="w-full aspect-[3/5]">
            <video
              src={item.video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainCharacter;
