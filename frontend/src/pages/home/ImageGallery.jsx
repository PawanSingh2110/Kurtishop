// ImageGallery.jsx
import React from "react";

const images = [
  {
    src: "https://www.pehrin.com/cdn/shop/files/IMG_8485.jpg?v=1749391170",
    title: "Cherry Red",
  },
  {
    src: "https://www.pehrin.com/cdn/shop/files/68BA2A48-4F79-446C-B74B-11D14490F67A.jpg?v=1743098484",
    title: "Gulnaar Kurti",
  },
  {
    src: "https://www.pehrin.com/cdn/shop/files/IMG_8737.jpg?v=1749391171",
    title: "The Neel Shirt",
  },
  {
    src: "https://www.pehrin.com/cdn/shop/files/99B430EE-B3B3-4EA9-86EF-EFE640B1BC67.jpg?v=1743096987",
    title: "Cherry Kurti",
  },
];

const ImageGallery = () => {
  return (
    <div className=" py-10 px-4 sm:px-6 lg:px-20">
      <h2 className="text-3xl sm:text-4xl aleo font-medium text-center py-5 text-red-900 font-serif mb-8">
        Image Gallery
      </h2>
      <div className="flex justify-center flex-wrap gap-4 sm:gap-6">
        {images.map((img, index) => (
          <div
            key={index}
            style={{ transform: `rotate(${index % 2 === 0 ? 10 : -10}deg)` }}
            className="bg-white shadow-lg p-2 rounded-lg transition-transform hover:scale-105 w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64"
          >
            <img
              src={`${img.src}&width=400`} // ✅ smaller image from Shopify CDN
              srcSet={`
                ${img.src}&width=300 300w,
                ${img.src}&width=500 500w,
                ${img.src}&width=800 800w
              `}
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 224px, 256px"
              alt={img.title}
              loading="lazy"
              className="w-full h-full object-cover rounded-lg transition duration-300 ease-in-out"
              style={{ filter: "blur(8px)", transition: "filter 0.3s ease-in-out" }}
              onLoad={(e) => (e.target.style.filter = "blur(0)")} // ✅ blur placeholder trick
            />
            <p className="text-center mt-2 font-serif text-sm sm:text-base">
              {img.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
