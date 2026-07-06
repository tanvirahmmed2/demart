'use client'
import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { Context } from '../helper/Context'
import { BiCart, BiLoaderAlt } from 'react-icons/bi'
import { FiArrowRight, FiTrendingUp } from 'react-icons/fi'

const Hero = () => {
  const { website, addToCart } = useContext(Context)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const themeColor = website?.theme_color || '#10b981'

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await axios.get('/api/hero')
        setProducts(res.data.products || [])
      } catch (err) {
        console.error("Failed to load hero products:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchHeroData()
  }, [])

  const getProductPriceInfo = (product) => {
    if (!product) return { hasDiscount: false, salePrice: 0, finalPrice: 0, discountPrice: 0, discountPercent: 0 }
    const salePrice = parseFloat(product.sale_price || 0)
    const discountPrice = parseFloat(product.discount_price || 0)
    const hasDiscount = discountPrice > 0
    const finalPrice = hasDiscount ? Math.max(0, salePrice - discountPrice) : salePrice
    const discountPercent = salePrice > 0 ? Math.round((discountPrice / salePrice) * 100) : 0
    return { hasDiscount, salePrice, finalPrice, discountPrice, discountPercent }
  }

  if (loading) {
    return (
      <div className="w-full py-24 flex justify-center items-center bg-white rounded-3xl my-6 border border-slate-100">
        <BiLoaderAlt className="text-4xl animate-spin" style={{ color: themeColor }} />
      </div>
    )
  }

  if (!products || products.length === 0) {
    return null
  }

  const p1 = products[0]
  const p1Price = getProductPriceInfo(p1)

  return (
    <div className="w-full bg-white py-12 px-4 md:px-8 border-b border-slate-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Product marketing info */}
        <div className="flex flex-col gap-6">
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm mb-4"
              style={{ color: themeColor, backgroundColor: `${themeColor}10` }}
            >
              <FiTrendingUp className="text-xs" /> Featured Deal
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
              {p1.category_name || 'Collection'}
            </span>
            <Link href={`/products/${p1.slug}`}>
              <h1 className="text-3xl md:text-5xl font-black text-slate-905 tracking-tight leading-tight hover:text-slate-800 transition-colors">
                {p1.name}
              </h1>
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {/* Price info */}
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-extrabold text-slate-900">৳{p1Price.finalPrice.toFixed(2)}</span>
              {p1Price.hasDiscount && (
                <>
                  <span className="text-base text-slate-400 line-through font-semibold">৳{p1Price.salePrice.toFixed(2)}</span>
                  <span className="text-xs bg-rose-500 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Save {p1Price.discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4 max-w-md">
              <Link
                href={`/products/${p1.slug}`}
                className="flex-1 text-center py-3.5 px-6 text-xs font-bold text-white rounded-2xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer flex items-center justify-center gap-2"
                style={{ backgroundColor: themeColor }}
              >
                Shop Now <FiArrowRight className="text-base" />
              </Link>
              <button
                onClick={() => addToCart(p1)}
                disabled={parseInt(p1.stock || p1.total_stock || 0) <= 0}
                className="p-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center"
                title="Add to Cart"
              >
                <BiCart className="text-xl" />
              </button>
            </div>
          </div>

          {/* Trust features row */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-800 text-xs font-black">Free</span>
              <span>Delivery</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-800 text-xs font-black">Secure</span>
              <span>Payments</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-800 text-xs font-black">Easy</span>
              <span>Returns</span>
            </div>
          </div>
        </div>

        {/* Right Column: Large product image card */}
        <div className="w-full max-w-lg mx-auto aspect-square relative bg-slate-50/50 rounded-3xl border border-slate-100/60 p-6 md:p-8 hover:shadow-md transition-shadow duration-300 group">
          <Link href={`/products/${p1.slug}`} className="w-full h-full block relative">
            <Image
              src={p1.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60'}
              alt={p1.name}
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              priority
              className="object-contain p-2 group-hover:scale-[1.02] transition-transform duration-500"
            />
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Hero