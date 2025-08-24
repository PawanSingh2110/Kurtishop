import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TestimonialSlider = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [index, setIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
const backendURL = import.meta.env.VITE_BACKEND_URL;
  // ✅ Fetch reviews with axios
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${backendURL}/review/reviews`,); // adjust URL if needed
        setTestimonials(res.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);



  // Auto slide every 3s
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [testimonials]);

  // Responsive check
  useEffect(() => {
    const updateCards = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(4);
      }
    };
    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  // Render stars
  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < count ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  // Get visible testimonials
  const getVisibleTestimonials = () => {
    if (testimonials.length === 0) return [];
    let visible = [];
    for (let i = 0; i < cardsToShow; i++) {
      visible.push(testimonials[(index + i) % testimonials.length]);
    }
    return visible;
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : (prev - 1) % testimonials.length
    );
  };

  return (
   <div>
    <h1 className="text-5xl text-center font-medium py-10">हमारी नहीं हमारी अप्सराओ की सुनो</h1>
     <div className="w-full overflow-x-hidden py-10 aleo relative">
      <div className="relative w-full flex items-center justify-center">
        <div className="flex justify-center  gap-6 transition-all duration-500">
          {getVisibleTestimonials().map((t, idx) => (
            <div
              key={t._id || idx}
              className="bg-white rounded-2xl shadow-md p-6 
                         w-80 min-h-[280px] 
                         sm:w-96 sm:min-h-[300px] 
                         md:w-84 md:min-h-[260px] 
                         flex-shrink-0 relative "
            >
              <div className="flex text-lg justify-start mb-2">
                {renderStars(t.star)}
              </div>
              <p className="text-gray-700 text-base mb-4 italic line-clamp-4">
                "{t.comment}"
              </p>
              <h3 className="text-lg font-semibold text-gray-900 text-start">
                {t.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Prev / Next Buttons */}
        {testimonials.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#580E0C] text-white p-3 rounded-full shadow-lg  transition"
            >
              <FaChevronLeft size={15} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#580E0C] text-white p-3 rounded-full shadow-lg  transition"
            >
              <FaChevronRight size={15} />
            </button>
          </>
        )}
      </div>
    </div>
   </div>
  );
};

export default TestimonialSlider;
