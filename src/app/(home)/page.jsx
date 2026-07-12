import Brands from '@/component/pages/Brands'
import Categories from '@/component/pages/Categories'
import Contact from '@/component/pages/Contact'
import Hero from '@/component/pages/Hero'
import Reviews from '@/component/pages/Reviews'
import StoreLocation from '@/component/pages/StoreLocation'
import TopDiscountedProducts from '@/component/pages/TopDiscountedProducts'
import TopSales from '@/component/pages/TopSales'
import React from 'react'

const Homepage = () => {
  return (
    <div className="w-full overflow-x-hidden max-w-7xl mx-auto">
      
      <Hero/>
      <TopSales/>
      <Categories/>
      <TopDiscountedProducts/>
      <Brands/>
      <Reviews/>
      <Contact/>
      <StoreLocation/>
    </div>
  )
}

export default Homepage
