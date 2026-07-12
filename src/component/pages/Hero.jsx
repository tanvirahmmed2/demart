'use client'
import React, { useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { Context } from '../helper/Context'
import { BiCart, BiLoaderAlt } from 'react-icons/bi'
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const Hero = () => {
  const { website, addToCart } = useContext(Context)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeIdx, setActiveIdx] = useState(0)

  const themeColor = website?.theme_color || '#10b981'
  const bgImages = ['/Fashion.jpg', '/fashionn.jpg', '/fassh.jpg']

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await axios.get('/api/hero')
        setProducts(res.data.products?.slice(0, 3) || [])
      } catch (err) {
        console.error("Failed to load hero products:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchHeroData()
  }, [])

  const handleNext = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % bgImages.length)
  }, [bgImages.length])

  const handlePrev = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + bgImages.length) % bgImages.length)
  }, [bgImages.length])

  // Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext()
    }, 5000)
    return () => clearInterval(timer)
  }, [handleNext])

  const getProductPriceInfo = (product) => {
    if (!product) return { hasDiscount: false, salePrice: 0, finalPrice: 0, discountPercent: 0 }
    const salePrice = parseFloat(product.sale_price || 0)
    const discountPrice = parseFloat(product.discount_price || 0)
    const hasDiscount = discountPrice > 0
    const finalPrice = hasDiscount ? Math.max(0, salePrice - discountPrice) : salePrice
    const discountPercent = salePrice > 0 ? Math.round((discountPrice / salePrice) * 100) : 0
    return { hasDiscount, salePrice, finalPrice, discountPercent }
  }

  if (loading) {
    return (
      <div className="w-full py-24 flex justify-center items-center bg-white rounded-2xl border border-slate-100">
        <BiLoaderAlt className="text-4xl animate-spin" style={{ color: themeColor }} />
      </div>
    )
  }

  const currentProduct = products[activeIdx % (products.length || 1)] || {}
  const productPrice = getProductPriceInfo(currentProduct)
  const isOutOfStock = currentProduct.product_id ? parseInt(currentProduct.stock || currentProduct.total_stock || 0) <= 0 : true

  return (
    <div className="w-full relative aspect-video  overflow-hidden border border-slate-100 flex items-center justify-center bg-slate-900 text-white z-10">
      
      <div className="absolute inset-0 z-0">
        {bgImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${
              activeIdx === idx ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 px-6 max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight uppercase text-white drop-shadow-md">
            {website?.name || 'Our Shop'}
          </h1>
          {website?.tagline && (
            <p className="text-xs text-slate-300 font-medium tracking-wide drop-shadow-sm">
              {website.tagline}
            </p>
          )}
        </div>

        <div className="w-16 h-0.5 bg-slate-500/50" />

        {currentProduct.product_id ? (
          <div className="flex flex-col items-center gap-3">
            <Link href={`/products/${currentProduct.slug}`} className="hover:underline">
              <h2 className="text-xl md:text-3xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
                {currentProduct.name}
              </h2>
            </Link>

            <div className="flex items-center gap-3 mt-1 justify-center drop-shadow-md">
              {productPrice.hasDiscount ? (
                <>
                  <span className="text-2xl md:text-3xl font-extrabold" style={{ color: themeColor }}>
                    ৳{productPrice.finalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm md:text-base text-slate-400 line-through font-medium">
                    ৳{productPrice.salePrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded">
                    Save {productPrice.discountPercent}%
                  </span>
                </>
              ) : (
                <span className="text-2xl md:text-3xl font-extrabold text-white">
                  ৳{productPrice.salePrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Simple CTA Buttons */}
            <div className="flex items-center gap-3 mt-4 justify-center">
              <Link
                href={`/products/${currentProduct.slug}`}
                className="px-6 py-3 text-xs font-bold text-white rounded-lg transition hover:brightness-110 flex items-center gap-1.5 shadow-md active:scale-95"
                style={{ backgroundColor: themeColor }}
              >
                Shop Now <FiArrowRight />
              </Link>
              <button
                onClick={() => addToCart(currentProduct)}
                disabled={isOutOfStock}
                className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center active:scale-95"
                title="Add to Cart"
              >
                <BiCart className="text-xl" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">Discover our best collections.</p>
        )}
      </div>

      {/* Simple slider buttons on hover (hidden on small screens) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:block z-20">
        <button
          onClick={handlePrev}
          className="p-2.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition active:scale-95 cursor-pointer border border-white/10"
          aria-label="Previous Slide"
        >
          <FiChevronLeft className="text-lg" />
        </button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block z-20">
        <button
          onClick={handleNext}
          className="p-2.5 bg-black/30 hover:bg-black/50 text-white rounded-full transition active:scale-95 cursor-pointer border border-white/10"
          aria-label="Next Slide"
        >
          <FiChevronRight className="text-lg" />
        </button>
      </div>

      {/* Simple indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {bgImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className="w-2 h-2 rounded-full transition-all cursor-pointer"
            style={{
              backgroundColor: activeIdx === idx ? themeColor : 'rgba(255, 255, 255, 0.4)'
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </div>
  )
}

export default Hero