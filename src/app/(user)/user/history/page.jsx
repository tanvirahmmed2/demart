'use client'
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '@/component/helper/Context'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  BiHistory, 
  BiPackage, 
  BiLoaderAlt,
  BiPrinter,
  BiNavigation,
  BiArrowBack
} from 'react-icons/bi'
import { printReceipt } from '@/lib/printreceipt'

export default function UserHistoryPage() {
  const { userSidebar, website } = useContext(Context)

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      try {
        const res = await axios.get('/api/sale/history')
        setOrders(res.data)
      } catch (err) {
        console.error('Failed to load user order history:', err)
        toast.error('Failed to fetch order history')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${userSidebar ? 'lg:pl-60' : 'lg:pl-8'}`}>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <BiHistory className="text-2xl text-primary" />
              Order History
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Review all your previous orders, shipping details, and invoice summaries.</p>
          </div>
          <Link href="/user" className="px-4 py-2 border border-slate-200 text-slate-700 bg-white text-xs font-bold hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 shadow-sm">
            <BiArrowBack /> Back to Profile
          </Link>
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-2">
            <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
            <p className="text-slate-500 text-xs font-semibold animate-pulse">Loading order history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="w-full bg-white border border-slate-200 py-16 px-6 text-center flex flex-col items-center gap-4 shadow-sm">
            <div className="w-14 h-14 flex items-center justify-center text-3xl bg-primary text-white font-bold">
              <BiPackage />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">No Orders Found</h3>
              <p className="text-slate-500 text-xs mt-1 max-w-sm leading-relaxed">You haven't placed any orders yet. Browse our store catalog to start shopping!</p>
            </div>
            <Link href="/products" className="mt-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer shadow-sm">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="w-full bg-white border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-650 font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="px-3 py-3 text-center">Order ID</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3 hidden lg:table-cell">Products</th>
                  <th className="px-3 py-3">Shipping Address</th>
                  <th className="px-3 py-3 text-right hidden sm:table-cell">Subtotal</th>
                  <th className="px-3 py-3 text-right hidden md:table-cell">Discount</th>
                  <th className="px-3 py-3 text-right hidden md:table-cell">Shipping</th>
                  <th className="px-3 py-3 text-right">Total</th>
                  <th className="px-3 py-3 text-right hidden sm:table-cell">Paid</th>
                  <th className="px-3 py-3 text-right hidden md:table-cell">Due</th>
                  <th className="px-3 py-3 text-center">Status</th>
                  <th className="px-3 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {orders.map((order) => {
                  const productsSummary = order.items
                    ? order.items.map(item => `${item.product_name}${item.variant_name ? ` (${item.variant_name})` : ''} x${item.quantity}`).join(', ')
                    : 'N/A'
                  const paidAmount = parseFloat(order.total_amount) - parseFloat(order.due_amount)
                  return (
                    <tr key={order.order_id} className="hover:bg-slate-50/70 transition">
                      <td className="px-3 py-3.5 text-center font-bold text-slate-900 font-mono">#{order.order_id}</td>
                      <td className="px-3 py-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-3 py-3.5 text-slate-600 max-w-[170px] truncate font-medium hidden lg:table-cell" title={productsSummary}>
                        {productsSummary}
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="font-semibold text-slate-800">{order.shipping_address}, {order.shipping_city}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{order.phone}</div>
                        {order.courier_name && (
                          <div className="text-[10px] text-slate-500 mt-0.5">Courier: {order.courier_name} {order.courier_tracking_id ? `(${order.courier_tracking_id})` : ''}</div>
                        )}
                        {order.note && (
                          <div className="text-[10px] text-rose-500 italic mt-0.5" title={order.note}>Note: "{order.note}"</div>
                        )}
                      </td>
                      <td className="px-3 py-3.5 text-right font-medium hidden sm:table-cell">৳{parseFloat(order.subtotal_amount).toFixed(2)}</td>
                      <td className="px-3 py-3.5 text-right text-rose-500 font-medium hidden md:table-cell">৳{parseFloat(order.total_discount_amount).toFixed(2)}</td>
                      <td className="px-3 py-3.5 text-right font-medium hidden md:table-cell">৳{parseFloat(order.delivery_charge).toFixed(2)}</td>
                      <td className="px-3 py-3.5 text-right font-bold text-slate-900">৳{parseFloat(order.total_amount).toFixed(2)}</td>
                      <td className="px-3 py-3.5 text-right text-emerald-600 font-bold hidden sm:table-cell">৳{paidAmount.toFixed(2)}</td>
                      <td className="px-3 py-3.5 text-right text-rose-600 font-bold hidden md:table-cell">৳{parseFloat(order.due_amount).toFixed(2)}</td>
                      <td className="px-3 py-3.5 text-center">
                        <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase border bg-sky-50 text-sky-700 border-sky-200">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <div className="flex flex-col gap-1.5 justify-center items-center">
                          <Link 
                            href={`/track-order?id=${order.order_id}`}
                            className="w-24 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition text-center flex items-center justify-center gap-1 shadow-sm"
                          >
                            <BiNavigation className="text-xs" /> Track Order
                          </Link>
                          <button 
                            onClick={() => printReceipt(order, website)}
                            className="w-24 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                          >
                            <BiPrinter className="text-xs" /> Print Invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}


