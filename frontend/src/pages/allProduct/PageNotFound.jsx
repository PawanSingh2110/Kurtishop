// src/pages/PageNotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import Pagenot from "../../assets/pagenotfound.png";

const PageNotFound = () => {
  return (
    <div className="relative flex flex-col justify-center items-center">
      <img src={Pagenot} alt="Page not found" className="h-screen object-contain" />
      
      <Link
        to="/"
        className="absolute bottom-10 text-3xl font-semibold underline hover:underline aleo"
      >
        Go Back to Home Page
      </Link>
    </div>
  );
};

export default PageNotFound;
