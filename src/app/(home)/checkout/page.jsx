'use client'
import React, { useContext, useState, useEffect } from 'react'
import { Context } from '@/component/helper/Context'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  BiShoppingBag, 
  BiUser, 
  BiPhone, 
  BiEnvelope, 
  BiMap, 
  BiCheckCircle,
  BiLoaderAlt,
  BiArrowBack,
  BiCreditCard,
  BiNote
} from 'react-icons/bi'
import Image from 'next/image'

export default function CheckoutPage() {
  const { cart, clearCart, user, website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('Dhaka')
  const [area, setArea] = useState('')
  const [note, setNote] = useState('')

  const [loading, setLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(null)

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setPhone(user.phone || '')
      setEmail(user.email || '')
    }
  }, [user])

  const subtotal = cart?.items ? cart.items.reduce((acc, item) => {
    const itemPrice = parseFloat(item.sale_price) - parseFloat(item.discount_price || 0)
    return acc + (itemPrice * item.quantity)
  }, 0) : 0

  const deliveryCharge = cart?.items && cart.items.length > 0 
    ? (city === 'Dhaka' ? 70 : 130) 
    : 0
  const totalAmount = subtotal + deliveryCharge

  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    if (!cart?.items || cart.items.length === 0) {
      toast.error('Your cart is empty!')
      return
    }

    if (!phone.trim()) {
      toast.error('Please provide a contact phone number')
      return
    }

    if (!address.trim()) {
      toast.error('Please provide a shipping address')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Placing your order...')

    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        shipping_address: address.trim(),
        shipping_city: city.trim(),
        shipping_area: area.trim(),
        note: note.trim(),
        items: cart.items.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id || null,
          quantity: item.quantity
        }))
      }

      const res = await axios.post('/api/sale', payload)

      if (res.status === 201) {
        toast.success('Order placed successfully!', { id: toastId })
        setOrderSuccess(res.data)
        clearCart()
      } else {
        toast.error(res.data?.error || 'Failed to place order', { id: toastId })
      }
    } catch (err) {
      console.error('Order submission error:', err)
      toast.error(err.response?.data?.error || 'Failed to complete transaction', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  // If order is placed successfully, render success view
  if (orderSuccess) {
    return (
      <div className="w-full min-h-[85vh] bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-xl p-8 text-center flex flex-col items-center gap-6">
          <BiCheckCircle className="text-7xl text-primary animate-bounce" />
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-secondary tracking-tight">Order Placed Successfully!</h1>
            <p className="text-slate-500 text-sm mt-1.5 font-medium">Thank you for your purchase. Your order details are logged below.</p>
          </div>

          <div className="w-full bg-slate-50 rounded-xl p-5 border border-slate-200/80 text-left flex flex-col gap-3 text-xs md:text-sm">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
              <span className="font-semibold text-slate-500">Order ID:</span>
              <span className="font-semibold text-slate-800">#ORD-{orderSuccess.order_id}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
              <span className="font-semibold text-slate-500">Total Paid/Due:</span>
              <span className="font-semibold text-primary text-base">৳{parseFloat(orderSuccess.total_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
              <span className="font-semibold text-slate-500">Payment Type:</span>
              <span className="font-semibold text-primary uppercase">Cash on Delivery (COD)</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-slate-500">Delivery Address:</span>
              <span className="text-slate-700 text-xs leading-relaxed">{address}, {city}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <Link 
              href="/products" 
              className="flex-1 py-3 bg-primary hover:bg-primary-light text-white rounded-xl font-semibold text-sm transition cursor-pointer shadow-md text-center block"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/" 
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition cursor-pointer text-center block"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-8 bg-slate-50 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-3xl">
          <BiShoppingBag />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Add some items from our collection to check out.</p>
        </div>
        <Link href="/products" className="px-6 py-2.5 bg-primary hover:bg-primary-light text-white rounded-xl text-sm font-semibold transition cursor-pointer shadow-md">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 p-4 md:p-10 relative overflow-hidden">
      
      <div className="w-full flex flex-col gap-6 relative z-10">
        
        <div>
          <Link href="/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
            <BiArrowBack className="text-base" /> Back to Catalog
          </Link>
          <h1 className="text-2xl md:text-3xl font-semibold text-secondary tracking-tight mt-2">Checkout Order</h1>
        </div>

        <form onSubmit={handlePlaceOrder} suppressHydrationWarning className="w-full flex flex-col lg:flex-row items-start justify-center gap-6">
          
          <div className="w-full flex flex-col gap-6 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-secondary flex items-center gap-2 border-b border-slate-100 pb-3">
              <BiMap className="text-xl text-primary" /> Shipping Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <BiUser className="text-sm text-slate-400" /> Full Name *
                </label>
                <input className="input-style" 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <BiPhone className="text-sm text-slate-400" /> Phone Number *
                </label>
                <input className="input-style" 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <BiEnvelope className="text-sm text-slate-400" /> Email Address (Optional)
              </label>
              <input className="input-style" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <BiMap className="text-sm text-slate-400" /> Delivery Street Address *
              </label>
              <textarea 
                required
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input-style outline-none transition resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">City / District *</label>
                <select 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition cursor-pointer"
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barisal">Barisal</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Mymensingh">Mymensingh</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Area / Thana</label>
                <input className="input-style" 
                  type="text" 
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <BiNote className="text-sm text-slate-400" /> Order Instructions / Notes (Optional)
              </label>
              <textarea 
                rows="2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="input-style outline-none transition resize-none"
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-6">
            
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h2 className="text-base font-semibold text-secondary border-b border-slate-100 pb-3">Order Items Summary</h2>
              
              <div className="flex flex-col gap-3 pr-1">
                {cart.items.map((item) => {
                  const finalPrice = parseFloat(item.sale_price) - parseFloat(item.discount_price || 0)
                  return (
                    <div key={`${item.product_id}-${item.variant || 'base'}`} className="flex items-center gap-3 py-1 text-xs">
                      <Image width={100} height={100} 
                        src={item.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150'} 
                        alt={item.name} 
                        className="w-10 h-10 object-cover rounded-lg border border-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                        <Link 
                          href={`/products/${item.slug}`} 
                          target="_blank"
                          className="font-semibold text-slate-800 hover:text-primary transition truncate block"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          {item.variant && <span className="font-semibold bg-slate-100 px-1 rounded text-slate-600">{item.variant}</span>}
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-slate-900 shrink-0">
                        ৳{(finalPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Pricing Math Details */}
              <div className="border-t border-slate-100 pt-4 flex flex-col gap-2 text-xs md:text-sm">
                <div className="flex justify-between items-center text-slate-500 font-medium">
                  <span>Cart Items Subtotal</span>
                  <span className="font-semibold text-slate-800">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-medium">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-slate-800">৳{deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-800 border-t border-slate-100 pt-3 text-sm font-semibold">
                  <span>Total Amount</span>
                  <span className="text-base font-semibold text-primary">
                    ৳{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Option */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h2 className="text-base font-semibold text-secondary flex items-center gap-1.5">
                <BiCreditCard className="text-lg text-primary" /> Payment Method
              </h2>
              
              <div className="border-2 border-primary bg-emerald-50/30 rounded-xl p-4 flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  id="cod"
                  name="payment"
                  defaultChecked 
                  className="w-4 h-4 cursor-pointer accent-emerald-600"
                />
                <label htmlFor="cod" className="flex flex-col cursor-pointer select-none">
                  <span className="text-xs font-semibold text-secondary">Cash on Delivery (COD)</span>
                  <span className="text-[10px] text-slate-500 mt-0.5 font-medium">Pay in cash when products are delivered to your doorstep.</span>
                </label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary hover:bg-primary-light text-white rounded-xl font-semibold text-sm shadow-md shadow-primary/15 transition hover:scale-[1.01] active:scale-100 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <BiLoaderAlt className="animate-spin text-lg" /> Processing...
                  </>
                ) : (
                  'Confirm and Place Order'
                )}
              </button>
            </div>

          </div>

        </form>

      </div>
    </div>
  )
}
