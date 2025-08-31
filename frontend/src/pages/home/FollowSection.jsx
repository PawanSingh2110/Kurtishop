// InstaFeed.jsx
import React from "react";
import {
  FaHeart,
  FaRegComment,
  FaPaperPlane,
  FaBookmark,
} from "react-icons/fa";

const posts = [
  {
    id: 1,
    image:
      "https://www.pehrin.com/cdn/shop/files/Being_a_desi_fashion_blogger_style_outfit_30_days_of_outfit_30_daychallenge_lifestyle_story_City_story_life_vlog_fashion_makeup_Cityvibe_hair_style_pinterest_reels_virtual_d.jpg?v=1749398642&width=500",
  },
  {
    id: 2,
    image:
      "https://www.pehrin.com/cdn/shop/files/68BA2A48-4F79-446C-B74B-11D14490F67A.jpg?v=1743098484&width=500",
  },
  {
    id: 3,
    image:
      "https://www.pehrin.com/cdn/shop/collections/FABB8675-712F-4340-872E-2CB63FBE709F.jpg?v=1754910343&width=500",
  },
  {
    id: 4,
    image:
      "https://www.pehrin.com/cdn/shop/files/Sunhari_Apsara_in_golden_bloom_Kurti_Comment_sunhari_for_links_fashion_blogger_style_outfit_30_days_of_outfit_30_daychallenge_lifestyle_story_City_story_life_vlog_fashion_makeup_Cityv.jpg?v=1749398576&width=500",
  },
];

const InstaFeed = () => {
  return (
    <div className="flex flex-col lg:flex-row items-start aleo justify-center px-6 py-10 bg-white">
      {/* Left text */}
      <div className="lg:w-1/4 h-20 text-center md:text-left md:mb-0">
        <h2 className="hidden lg:block lg:pt-40  text-4xl font-serif text-brown-900">
          Follow us on <br />
          <span className="font-bold">@pehrin_</span>
        </h2>

        <h2 className="lg:hidden md:mx-40 text-center text-3xl whitespace-nowrap font-serif text-brown-900">
          Follow us on <span className="font-bold">@pehrin_</span>
        </h2>
      </div>

      {/* Scrollable Flex Row */}
      <div className="w-screen lg:w-2/3 overflow-x-auto scrollbar-hidden">
        <div className="flex gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="min-w-[20rem] border border-gray-300 rounded-md p-3 bg-white shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <img
                  src="https://www.pehrin.com/cdn/shop/files/IMG_20250326_211833_051-removebg-preview_7a977942-6503-488b-b479-36c6df9e7306.png?v=1743085320&width=80"
                  alt="logo"
                  className="w-8 h-8 rounded-full"
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold text-sm">@pehrin_</p>
                  <p className="text-xs text-gray-500">Jaipur, Rajasthan</p>
                </div>
              </div>

              {/* Image */}
              <img
                src={post.image}
                alt="post"
                loading="lazy"
                className="w-full h-[500px] object-cover rounded-md"
              />

              {/* Actions */}
              <div className="flex justify-between items-center mt-3 text-xl text-gray-700">
                <div className="flex gap-4">
                  <FaHeart className="text-red-500 cursor-pointer" />
                  <FaRegComment className="text-blue-500 cursor-pointer" />
                  <FaPaperPlane className="text-yellow-500 cursor-pointer" />
                </div>
                <FaBookmark className="text-green-500 cursor-pointer" />
              </div>

              {/* Footer */}
              <p className="text-sm mt-2 font-semibold">@pehrin_</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstaFeed;
