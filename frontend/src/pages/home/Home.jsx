import React from 'react'
import Herosection from './Herosection'
import Latestsection from './Latestsection'
import Collections from './Collections'
import MainCharacter from './MainCharacter'
import Band from "./Band.jsx"
import Review from './Review.jsx'
import ImageGallery from './ImageGallery.jsx'
import FollowSection from './FollowSection.jsx'
const Home = () => {
  return (
    <div className='text-[#580E0C]'>
      <Herosection/>
      <Collections/>
      <Latestsection/>
      
      <Band/>
      <MainCharacter/>
      <ImageGallery/>
      <Review/>
      <FollowSection/>
      
    </div>
  )
}

export default Home
