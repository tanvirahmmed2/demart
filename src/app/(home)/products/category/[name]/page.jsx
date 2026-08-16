'use client'
import React, { useState, useEffect, useContext } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Context } from '@/component/helper/Context'
import ProductCard from '@/component/cards/Product'
import { 
  BiSearch, 
  BiFilterAlt, 
  BiSort, 
  BiChevronRight, 
  BiLoaderAlt, 
  BiCategory,
  BiArrowBack,
  BiDollar
} from 'react-icons/bi'
import Image from 'next/image'

export default function ProductsCategorySlugPage() {
  const params = useParams()
  const slug = params?.name
  const router = useRouter()

  const { categories, website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters & Sorting state
  const [sortBy, setSortBy] = useState('newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    if (!slug) return

    const fetchCategoryAndProducts = async () => {
      setLoading(true)
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`/api/category/${slug}`),
          axios.get(`/api/product?category=${slug}`)
        ])
        setCategory(catRes.data)
        setProducts(prodRes.data)
      } catch (err) {
        console.error('Failed to load category products:', err)
        toast.error('Category not found or empty catalog')
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryAndProducts()
  }, [slug])

  // Get parent and sibling subcategories for quick filters
  let parentCat = null
  let subcategories = []

  if (category && categories) {
    if (category.parent_id === null) {
      // Active category is a Parent Category
      const matched = categories.find(c => c.id === category.category_id)
      subcategories = matched?.subcategory || []
    } else {
      // Active category is a Subcategory
      parentCat = categories.find(c => c.id === category.parent_id)
      subcategories = parentCat?.subcategory || []
    }
  }

  // Reset pagination to page 1 on any filter parameter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [sortBy, minPrice, maxPrice, inStockOnly])

  // Filter & Sort Logic
  const filteredProducts = products
    .filter(p => {
      const finalPrice = p.discount_price && parseFloat(p.discount_price) > 0 
        ? Math.max(0, parseFloat(p.sale_price) - parseFloat(p.discount_price)) 
        : parseFloat(p.sale_price)

      const matchesMin = minPrice === '' || finalPrice >= parseFloat(minPrice)
      const matchesMax = maxPrice === '' || finalPrice <= parseFloat(maxPrice)
      const matchesStock = !inStockOnly || ((p.total_stock !== undefined ? parseInt(p.total_stock, 10) : parseInt(p.stock, 10)) > 0)

      return matchesMin && matchesMax && matchesStock
    })
    .sort((a, b) => {
      const priceA = a.discount_price && parseFloat(a.discount_price) > 0 ? Math.max(0, parseFloat(a.sale_price) - parseFloat(a.discount_price)) : parseFloat(a.sale_price)
      const priceB = b.discount_price && parseFloat(b.discount_price) > 0 ? Math.max(0, parseFloat(b.sale_price) - parseFloat(b.discount_price)) : parseFloat(b.sale_price)

      if (sortBy === 'price-low') return priceA - priceB
      if (sortBy === 'price-high') return priceB - priceA
      if (sortBy === 'name-az') return a.name.localeCompare(b.name)
      return b.product_id - a.product_id // newest first
    })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (loading) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center gap-3 bg-slate-50">
        <BiLoaderAlt className="text-4xl text-emerald-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Loading products catalog...</span>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-3xl">
            <BiCategory />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Category Not Found</h2>
          <p className="text-sm text-slate-500">The category you are looking for does not exist or has been removed.</p>
          <Link href="/products/category" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition">
            Back to Categories
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen py-12 p-4 md:p-20 relative overflow-hidden">
      
      <div 
        className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{ backgroundColor: themeColor }}
      />

      <div className="w-full mx-auto flex flex-col gap-6 relative z-10">
        
        <div className="flex items-center flex-wrap gap-1.5 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-slate-600 transition">Home</Link>
          <BiChevronRight />
          <Link href="/products/category" className="hover:text-slate-600 transition">Categories</Link>
          <BiChevronRight />
          {parentCat ? (
            <>
              <Link href={`/products/category/${parentCat.slug}`} className="hover:text-slate-600 transition">
                {parentCat.category}
              </Link>
              <BiChevronRight />
            </>
          ) : null}
          <span className="text-slate-700">{category.name}</span>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold text-secondary tracking-tight">{category.name}</h1>
          <p className="text-xs text-slate-550">
            {category.description || `Browse products under the ${category.name} category`}
          </p>
        </div>

        <div className="w-full bg-white p-4 md:px-6 md:py-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-row items-center gap-3 justify-between flex-1">
            
            {subcategories.length > 0 && (
              <div className="relative min-w-45 flex-1 sm:flex-initial">
                <BiCategory className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <select
                  value={slug || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      router.push(`/products/category/${e.target.value}`)
                    }
                  }}
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition cursor-pointer"
                >
                  {parentCat ? (
                    <option value={parentCat.slug}>All {parentCat.category}</option>
                  ) : (
                    <option value={category.slug}>All {category.name}</option>
                  )}
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.slug}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="relative min-w-40 flex-1 sm:flex-initial">
              <BiSort className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 px-1">৳</span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-16 md:w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500 text-slate-700"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-16 md:w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500 text-slate-700"
              />
            </div>

            <label className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80 cursor-pointer select-none">
              <input
                type="checkbox"
                id="inStockOnly"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer accent-emerald-600"
              />
              <span className="text-xs font-bold text-slate-700">In Stock Only</span>
            </label>

            {(minPrice || maxPrice || inStockOnly) && (
              <button
                onClick={() => {
                  setMinPrice('')
                  setMaxPrice('')
                  setInStockOnly(false)
                }}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition cursor-pointer text-center"
              >
                Clear Filters
              </button>
            )}

          </div>

          

        </div>

        {/* Product Catalog Container */}
        <div className="flex flex-col gap-6">

            {paginatedProducts.length === 0 ? (
              <div className="w-full bg-white rounded-3xl border border-slate-105 p-16 text-center shadow-sm flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-350 text-4xl">
                  <BiSearch />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">No products found</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                    Try adjusting your search criteria, price range filters, or subcategories to locate items.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {paginatedProducts.map((p) => (
                    <ProductCard key={p.product_id} product={p} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-8 border-t border-slate-100 pt-6">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNum = index + 1
                      const isCurrent = currentPage === pageNum
                      
                      if (totalPages > 5 && Math.abs(currentPage - pageNum) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                        if (pageNum === 2 || pageNum === totalPages - 1) {
                          return <span key={pageNum} className="text-slate-400 text-xs px-1">...</span>
                        }
                        return null
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                            isCurrent 
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-605/10' 
                              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-350'
                          }`}
                          style={isCurrent ? { backgroundColor: themeColor } : {}}
                        >
                          {pageNum}
                        </button>
                      )
                    })}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}

          </div>

      </div>
    </div>
  )
}
