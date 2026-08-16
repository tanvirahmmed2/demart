'use client'
import React, { useState, useContext, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Context } from '@/component/helper/Context'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  BiSearch, 
  BiPackage, 
  BiMap, 
  BiTime, 
  BiCheckCircle, 
  BiSolidMap, 
  BiChevronRight,
  BiLoaderAlt,
  BiMessageAltDetail,
  BiInfoCircle,
  BiPrinter,
  BiNavigation
} from 'react-icons/bi'
import { printReceipt } from '@/lib/printreceipt'
import Image from 'next/image'

function TrackOrderContent() {
  const { website } = useContext(Context)
  const searchParams = useSearchParams()

  const [orderIdInput, setOrderIdInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const [searched, setSearched] = useState(false)

  const fetchOrder = async (rawId) => {
    const cleanId = String(rawId).replace(/\D/g, '').trim()
    if (!cleanId) {
      toast.error('Please enter a valid numeric Order ID')
      return
    }

    setLoading(true)
    setSearched(true)
    setOrder(null)

    try {
      const res = await axios.get(`/api/sale/${cleanId}`)
      setOrder(res.data)
    } catch (err) {
      console.error('Failed to track order:', err)
    } finally {
      setLoading(false)
    }
  }

  // Handle URL query parameters e.g. /track-order?id=5
  useEffect(() => {
    const urlId = searchParams?.get('id') || searchParams?.get('order_id')
    if (urlId) {
      setOrderIdInput(urlId)
      fetchOrder(urlId)
    }
  }, [searchParams])

  const handleTrackOrder = async (e) => {
    e.preventDefault()
    fetchOrder(orderIdInput)
  }

  const getStatusStep = (status) => {
    switch (status) {
      case 'pending': return 1
      case 'confirmed':
      case 'processing':
      case 'shipped':
        return 2
      case 'out_for_delivery': return 3
      case 'delivered': return 4
      default: return 0 
    }
  }

  const activeStep = order ? getStatusStep(order.status) : 0

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 p-4 md:p-16 relative overflow-hidden">
      
      <div className="w-full flex flex-col gap-8 relative z-10">
        
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <BiNavigation className="text-slate-800" />
            Track Your Order
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1">Enter your order ID number to check live dispatch and delivery status.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleTrackOrder} className="w-full flex gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex-1 flex items-center gap-2 px-3">
            <BiSearch className="text-slate-400 text-xl shrink-0" />
            <input className="input-style border-none focus:ring-0 shadow-none px-0"
              type="text"
              required
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {loading ? <BiLoaderAlt className="animate-spin text-lg" /> : 'Track Order'}
          </button>
        </form>

        {loading && (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-2">
            <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
            <p className="text-slate-500 text-xs font-semibold animate-pulse">Checking tracking system logs...</p>
          </div>
        )}

        {searched && !loading && !order && (
          <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-12 text-center flex flex-col items-center gap-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 text-3xl border border-rose-100">
              <BiInfoCircle />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Order Not Found</h3>
              <p className="text-slate-500 text-xs mt-1 max-w-sm leading-relaxed">We couldn't find any checkout details matching the ID "{orderIdInput}". Please check the Order ID and try again.</p>
            </div>
          </div>
        )}

        {order && !loading && (
          <div className="flex flex-col gap-6 w-full bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-xs">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Order ID</span>
                  <span className="text-lg font-black text-slate-900 font-mono">#ORD-{order.order_id}</span>
                </div>
                <button
                  onClick={() => printReceipt(order, website)}
                  className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xxs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <BiPrinter className="text-sm" /> Print Invoice
                </button>
              </div>
              <div className="flex flex-col sm:items-end gap-1">
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider text-left sm:text-right">Current Status</span>
                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                  order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
                  ['cancelled', 'failed'].includes(order.status) ? 'bg-rose-50 text-rose-700 border-rose-200/60' :
                  order.status === 'returned' ? 'bg-amber-50 text-amber-700 border-amber-200/60' :
                  'bg-sky-50 text-sky-700 border-sky-200/60'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Stepper progress */}
            {!['cancelled', 'returned', 'failed'].includes(order.status) && activeStep > 0 && (
              <div className="py-6 border-b border-slate-100">
                <div className="flex items-center justify-between w-full relative text-slate-700 text-xxs md:text-xs">
                  
                  <div className="absolute top-4 left-[10%] right-[10%] h-1 bg-slate-100 z-0">
                    <div 
                      className="h-full transition-all duration-500 bg-slate-900 rounded-full" 
                      style={{ 
                        width: `${((activeStep - 1) / 3) * 100}%`
                      }}
                    />
                  </div>

                  <div className="flex flex-col items-center gap-1.5 z-10 w-[20%]">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition ${
                      activeStep >= 1 ? 'border-slate-900 bg-slate-900 text-white font-bold' : 'border-slate-200 bg-white text-slate-400'
                    }`}>
                      ✓
                    </div>
                    <span className="font-bold">Order Placed</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 z-10 w-[20%]">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition ${
                      activeStep >= 2 ? 'border-slate-900 bg-slate-900 text-white font-bold' : 'border-slate-200 bg-white text-slate-400'
                    }`}>
                      {activeStep > 2 ? '✓' : '2'}
                    </div>
                    <span className="font-bold">Confirmed</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 z-10 w-[20%]">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition ${
                      activeStep >= 3 ? 'border-slate-900 bg-slate-900 text-white font-bold' : 'border-slate-200 bg-white text-slate-400'
                    }`}>
                      {activeStep > 3 ? '✓' : '3'}
                    </div>
                    <span className="font-bold">Dispatched</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 z-10 w-[20%]">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition ${
                      activeStep >= 4 ? 'border-slate-900 bg-slate-900 text-white font-bold' : 'border-slate-200 bg-white text-slate-400'
                    }`}>
                      {activeStep > 4 ? '✓' : '4'}
                    </div>
                    <span className="font-bold">Delivered</span>
                  </div>
                </div>
              </div>
            )}

            {/* Address & Recipient Info */}
            <div className="flex flex-col gap-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200/60 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-xxs">Recipient Details</span>
                <span className="font-bold text-slate-900">{order.customer_name || 'Customer'}</span>
              </div>
              <div className="flex flex-col gap-0.5 border-t border-slate-200/60 pt-2.5 mt-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-xxs">Shipping Address</span>
                <span className="text-slate-700 flex items-start gap-1 leading-relaxed font-semibold">
                  <BiSolidMap className="text-sm text-slate-800 mt-0.5 shrink-0" /> {order.shipping_address}, {order.shipping_city} {order.shipping_area ? `(${order.shipping_area})` : ''}
                </span>
              </div>
              {order.courier_name && (
                <div className="flex flex-col gap-0.5 border-t border-slate-200/60 pt-2.5 mt-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-xxs">Courier Dispatch Details</span>
                  <span className="font-semibold text-slate-900">
                    {order.courier_name} {order.courier_tracking_id ? ` (Tracking ID: ${order.courier_tracking_id})` : ''}
                  </span>
                </div>
              )}
              {order.note && (
                <div className="flex flex-col gap-0.5 border-t border-slate-200/60 pt-2.5 mt-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-xxs">Delivery Note</span>
                  <span className="text-slate-600 flex items-start gap-1 leading-relaxed italic font-medium">
                    <BiMessageAltDetail className="text-sm text-slate-400 mt-0.5 shrink-0" /> "{order.note}"
                  </span>
                </div>
              )}
            </div>

            {/* Ordered items */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordered Items</span>
              <div className="flex flex-col border border-slate-200/80 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3.5 bg-white hover:bg-slate-50/50 transition">
                    {item.product_image && (
                      <Image width={100} height={100} 
                        src={item.product_image} 
                        alt={item.product_name} 
                        className="w-10 h-10 object-cover rounded-lg border border-slate-100 shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <span className="font-bold text-slate-900 line-clamp-1">{item.product_name}</span>
                      {item.variant_name && <span className="text-xxs text-slate-400 font-bold uppercase">Option: {item.variant_name}</span>}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-slate-900">৳{(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                      <div className="text-xxs text-slate-400 mt-0.5 font-medium">৳{parseFloat(item.price).toFixed(2)} x {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown summary */}
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-2 text-xs md:text-sm items-end text-right">
              <div className="flex justify-between items-center w-full max-w-xs text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-900">৳{parseFloat(order.subtotal_amount).toFixed(2)}</span>
              </div>
              {parseFloat(order.total_discount_amount) > 0 && (
                <div className="flex justify-between items-center w-full max-w-xs text-rose-600">
                  <span>Discount:</span>
                  <span className="font-bold">-৳{parseFloat(order.total_discount_amount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center w-full max-w-xs text-slate-600">
                <span>Delivery Charge:</span>
                <span className="font-bold text-slate-900">৳{parseFloat(order.delivery_charge).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center w-full max-w-xs text-slate-900 border-t border-slate-100 pt-2 text-sm font-bold">
                <span>Total Invoice:</span>
                <span className="font-bold">৳{parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center w-full max-w-xs text-slate-600 text-xs">
                <span>Paid Amount:</span>
                <span className="font-bold text-emerald-600">৳{(parseFloat(order.total_amount) - parseFloat(order.due_amount)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center w-full max-w-xs text-slate-600 text-xs">
                <span>Due Amount:</span>
                <span className="font-bold text-rose-600">৳{parseFloat(order.due_amount).toFixed(2)}</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  )
}
