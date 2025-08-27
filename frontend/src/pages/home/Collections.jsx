import React from "react";
import { Link } from "react-router-dom";

const collect = [
  {
    image: "https://www.pehrin.com/cdn/shop/collections/IMG_5827.jpg?v=1749549219&width=400",
    name: "Pooh",
    link: "/category/pooh",
  },
  {
    image: "https://www.pehrin.com/cdn/shop/collections/CEFEEAB4-7E24-4697-949F-CFF4DE1B88F1.jpg?v=1749549175&width=400",
    name: "Naina",
    link: "/category/naina",
  },
  {
    image: "https://www.pehrin.com/cdn/shop/collections/FABB8675-712F-4340-872E-2CB63FBE709F.jpg?v=1749549200&width=400",
    name: "Geet",
    link: "/category/geet",
  },
  {
    image: "https://www.pehrin.com/cdn/shop/files/Sunhari_Apsara_in_golden_bloom_Kurti_Comment_sunhari_for_links_fashion_blogger_style_outfit_30_days_of_outfit_30_daychallenge_lifestyle_story_City_story_life_vlog_fashion_makeup_Cityv.jpg?v=1749398576&width=400",
    name: "Alisha",
    link: "/category/alisha",
  },
];

const Collections = () => {
  return (
    <div className="mb-10 px-4">
      <h1 className="text-[#580E0C] font-medium aleo text-5xl whitespace-nowrap text-center p-5">
        Our <span className="text-[#580E0C] font-light">Collection</span>
      </h1>

      {/* ✅ Grid for small + medium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 place-items-center lg:hidden">
        {collect.map((item, i) => (
          <div key={i} className="w-full max-w-[350px] transition-transform duration-700">
            <Link to={item.link}>
              <div className="h-[450px] overflow-hidden rounded-lg shadow-md">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy" // ✅ Lazy load
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h1 className="aleo font-medium mt-2 text-[#580E0C] text-lg">
                {item.name}
                <span className="inline-block text-[#580E0C] ml-1">→</span>
              </h1>
            </Link>
          </div>
        ))}
      </div>

      {/* ✅ Horizontal scroll on large screens */}
      <div className="hidden lg:flex overflow-x-auto gap-10 py-4 scrollbar-hidden">
        {collect.map((item, i) => (
          <div
            key={i}
            className="min-w-[330px] max-w-[300px] flex-shrink-0 transition-transform duration-700 hover:-rotate-2"
          >
            <Link to={item.link}>
              <div className="h-[500px] overflow-hidden rounded-lg shadow-md">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy" // ✅ Lazy load
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h1 className="aleo font-medium mt-2 text-[#580E0C] text-base md:text-lg">
                {item.name}
                <span className="inline-block text-[#580E0C] ml-1">→</span>
              </h1>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;
