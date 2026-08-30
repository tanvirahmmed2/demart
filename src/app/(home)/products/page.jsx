'use client'
import React, { useState, useEffect, useContext } from 'react'
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
  BiDollar,
  BiCheckCircle
} from 'react-icons/bi'

export default function ProductsPage() {
  const { categories, website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters, Category Selection, & Sorting State
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [sortBy, setSortBy] = useState('newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Fetch all active products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await axios.get('/api/product')
        setProducts(res.data.filter(p => p.is_active !== false))
      } catch (err) {
        console.error('Failed to load products list:', err)
        toast.error('Failed to load products catalog')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Reset pagination to page 1 whenever any filter parameter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [sortBy, minPrice, maxPrice, inStockOnly, selectedCategoryId])

  // Get active parent category object if selected
  const activeParentCat = categories.find(c => c.id === selectedCategoryId)
  
  // Also check if the selected category is a subcategory of a parent
  let activeSubCat = null
  let activeParentOfSub = null
  
  if (!activeParentCat && selectedCategoryId) {
    for (const parent of categories) {
      const matchedSub = parent.subcategory?.find(s => s.id === selectedCategoryId)
      if (matchedSub) {
        activeSubCat = matchedSub
        activeParentOfSub = parent
        break
      }
    }
  }

  // Filter & Sort Logic
  const filteredProducts = products
    .filter(p => {
      // 1. Category & Subcategory match
      let matchesCategory = true
      if (selectedCategoryId) {
        if (activeParentCat) {
          // If parent category is selected, include products from this parent and all its subcategories
          const subIds = activeParentCat.subcategory?.map(sub => sub.id) || []
          matchesCategory = p.category_id === selectedCategoryId || subIds.includes(p.category_id)
        } else {
          // If subcategory is selected, match strictly
          matchesCategory = p.category_id === selectedCategoryId
        }
      }

      // 2. Price Range match
      const finalPrice = p.discount_price && parseFloat(p.discount_price) > 0 
        ? Math.max(0, parseFloat(p.sale_price) - parseFloat(p.discount_price)) 
        : parseFloat(p.sale_price)
      const matchesMin = minPrice === '' || finalPrice >= parseFloat(minPrice)
      const matchesMax = maxPrice === '' || finalPrice <= parseFloat(maxPrice)

      const matchesStock = !inStockOnly || ((p.total_stock !== undefined ? parseInt(p.total_stock, 10) : parseInt(p.stock, 10)) > 0)

      return matchesCategory && matchesMin && matchesMax && matchesStock
    })
    .sort((a, b) => {
      const priceA = a.discount_price && parseFloat(a.discount_price) > 0 ? Math.max(0, parseFloat(a.sale_price) - parseFloat(a.discount_price)) : parseFloat(a.sale_price)
      const priceB = b.discount_price && parseFloat(b.discount_price) > 0 ? Math.max(0, parseFloat(b.sale_price) - parseFloat(b.discount_price)) : parseFloat(b.sale_price)

      if (sortBy === 'price-low') return priceA - priceB
      if (sortBy === 'price-high') return priceB - priceA
      if (sortBy === 'name-az') return a.name.localeCompare(b.name)
      return b.product_id - a.product_id
    })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
        <BiLoaderAlt className="text-4xl text-primary animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Loading products catalog...</span>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen  p-4 md:p-10 relative overflow-hidden">
      
      <div 
        className="absolute top-[-10%] bg-primary left-[-10%] w-[35%] h-[35%] rounded-full blur-[100px] opacity-10 pointer-events-none"
        
      />

      <div className="w-full flex flex-col gap-8 relative z-10">
        
        <div className="flex items-center flex-wrap gap-1.5 text-xs font-semibold text-tertiary-dark/40">
          <Link href="/" className="text-tertiary-dark/70 transition">Home</Link>
          <BiChevronRight />
          <span className="text-tertiary-dark">All Products</span>
          {activeParentCat && (
            <>
              <BiChevronRight />
              <span className="text-tertiary-dark">{activeParentCat.category}</span>
            </>
          )}
          {activeSubCat && (
            <>
              <BiChevronRight />
              <button 
                onClick={() => setSelectedCategoryId(activeParentOfSub.id)} 
                className="text-tertiary-dark/70 transition font-semibold"
              >
                {activeParentOfSub.category}
              </button>
              <BiChevronRight />
              <span className="text-tertiary-dark">{activeSubCat.name}</span>
            </>
          )}
        </div>

        {/* Top Horizontal Filter Bar */}
        <div className="w-full bg-white p-4 md:px-6 md:py-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-row items-center justify-between flex-1">
            
            <div className="relative min-w-40 flex-1 sm:flex-initial">
              <BiCategory className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary-dark/40 text-base" />
              <select
                value={selectedCategoryId || ''}
                onChange={(e) => setSelectedCategoryId(e.target.value ? parseInt(e.target.value, 10) : null)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-tertiary-dark outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((parent) => (
                  <React.Fragment key={parent.id}>
                    <option value={parent.id} className="font-bold">{parent.category}</option>
                    {parent.subcategory?.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        &nbsp;&nbsp;&nbsp;&nbsp;{sub.name}
                      </option>
                    ))}
                  </React.Fragment>
                ))}
              </select>
            </div>

            <div className="relative min-w-40 flex-1 sm:flex-initial">
              <BiSort className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary-dark/40 text-base" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-tertiary-dark outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-tertiary-dark/40 px-1">৳</span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-16 md:w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500 text-tertiary-dark"
              />
              <span className="text-tertiary-dark/40 text-xs">-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-16 md:w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500 text-tertiary-dark"
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
              <span className="text-xs font-bold text-tertiary-dark">In Stock Only</span>
            </label>

            {(minPrice || maxPrice || inStockOnly || selectedCategoryId) && (
              <button
                onClick={() => {
                  setMinPrice('')
                  setMaxPrice('')
                  setInStockOnly(false)
                  setSelectedCategoryId(null)
                }}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition cursor-pointer text-center"
              >
                Clear Filters
              </button>
            )}

          </div>

         
        </div>

        <div className="flex flex-col gap-6">

            {paginatedProducts.length === 0 ? (
              <div className="w-full bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-350 text-4xl">
                  <BiCategory />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">No products found</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                    Try adjusting your filters, price range criteria, or categories to locate products.
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

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-8 border-t border-slate-100 pt-6">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-tertiary-dark transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNum = index + 1
                      const isCurrent = currentPage === pageNum
                      
                      if (totalPages > 5 && Math.abs(currentPage - pageNum) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                        if (pageNum === 2 || pageNum === totalPages - 1) {
                          return <span key={pageNum} className="text-tertiary-dark/40 text-xs px-1">...</span>
                        }
                        return null
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                            isCurrent 
                              ? 'bg-primary text-white shadow-md shadow-emerald-605/10' 
                              : 'bg-white hover:bg-slate-50 text-tertiary-dark border border-slate-200 hover:border-slate-350'
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
                      className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-tertiary-dark transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
