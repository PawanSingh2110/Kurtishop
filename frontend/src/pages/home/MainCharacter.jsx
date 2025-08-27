// MainCharacter.jsx
import React, { useEffect, useRef } from "react";

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

// ✅ Video wrapper that auto-plays only when visible
const VideoCard = ({ src, autoPlayFirst = false }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Intersection observer to play/pause
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {}); // play if visible
          } else {
            video.pause(); // pause if not visible
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      muted
      playsInline
      preload="none" // ✅ don't load until needed
      autoPlay={autoPlayFirst} // ✅ only first video auto-plays
      className="w-full h-full object-cover rounded-lg"
    />
  );
};

const MainCharacter = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl md:text-4xl font-medium aleo text-center mb-6">
        Shop To Be The Main Character
      </h1>

      {/* ✅ Small screens: horizontal scroll (swipe) */}
      <div className="md:hidden flex gap-4 overflow-x-auto scrollbar-hidden">
        {videomain.map((item, index) => (
          <div key={index} className="min-w-[310px] aspect-[3/4] h-[520px]">
            <VideoCard src={item.video} autoPlayFirst={index === 0} />
          </div>
        ))}
      </div>

      {/* ✅ From md and up: grid layout */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
        {videomain.map((item, index) => (
          <div key={index} className="w-full aspect-[3/5]">
            <VideoCard src={item.video} autoPlayFirst={index === 0} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainCharacter;
