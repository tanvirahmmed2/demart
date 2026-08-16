'use client'
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '@/component/helper/Context'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  BiRefresh, 
  BiSearch, 
  BiLoaderAlt,
  BiFilterAlt
} from 'react-icons/bi'

export default function AdminSalesOrdersPage() {
  const { dashSidebar } = useContext(Context)

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const statusParam = statusFilter !== 'all' ? `?status=${statusFilter}` : ''
      const res = await axios.get(`/api/sale${statusParam}`)
      setOrders(res.data)
    } catch (err) {
      console.error('Failed to load orders:', err)
      toast.error('Failed to fetch sales orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_id.toString().includes(searchTerm) ||
      (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.phone.includes(searchTerm) ||
      (order.shipping_address && order.shipping_address.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  return (
    <div className={`w-full min-h-screen bg-[#F1F5F9] pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-64' : 'lg:pl-8'}`}>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Admin Orders Desk</h1>
            <p className="text-xs text-slate-500 mt-1">Global administrative console for searching and fetching client orders by status.</p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 transition cursor-pointer shadow-xs disabled:opacity-40"
          >
            <BiRefresh className={`text-xl ${loading ? 'animate-spin text-[#73976A]' : ''}`} />
          </button>
        </div>

        {/* Status Select Option and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          
          {/* SELECT OPTION for fetching orders by status */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <BiFilterAlt className="text-slate-500 text-lg shrink-0" />
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Order Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 bg-[#F1F5F9] border border-slate-200 text-slate-800 rounded-xl text-xs font-bold shadow-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#73976A]/20 focus:border-[#73976A] cursor-pointer capitalize transition"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="out_for_delivery">Out For Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2 bg-[#F1F5F9] px-3 py-2 border border-slate-200 rounded-xl w-full sm:w-80 shadow-xs">
            <BiSearch className="text-slate-400 text-lg shrink-0" />
            <input 
              className="input-style border-none focus:ring-0 shadow-none px-0 bg-transparent text-xs"
              type="text"
              placeholder="Search ID, customer, phone, address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-2">
            <BiLoaderAlt className="animate-spin text-4xl text-[#73976A]" />
            <p className="text-slate-500 text-sm font-semibold animate-pulse">Fetching orders database...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="w-full bg-white border border-slate-200 rounded-2xl py-16 px-6 text-center flex flex-col items-center gap-3 shadow-xs">
            <h3 className="font-bold text-slate-800 text-base">No Orders Found</h3>
            <p className="text-slate-500 text-xs mt-1">There are no orders that match your selected status or search term.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto bg-white border border-slate-200 rounded-2xl shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F1F5F9] text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-3 md:px-4 py-3 text-center">ID</th>
                  <th className="px-3 md:px-4 py-3 hidden sm:table-cell">Date</th>
                  <th className="px-3 md:px-4 py-3">Customer</th>
                  <th className="px-3 md:px-4 py-3 hidden md:table-cell">Phone</th>
                  <th className="px-3 md:px-4 py-3 hidden lg:table-cell">Items Summary</th>
                  <th className="px-3 md:px-4 py-3 text-right hidden sm:table-cell">Total Price</th>
                  <th className="px-3 md:px-4 py-3 text-right hidden md:table-cell">Discount</th>
                  <th className="px-3 md:px-4 py-3 text-right">Payable</th>
                  <th className="px-3 md:px-4 py-3 text-center">Status</th>
                  <th className="px-3 md:px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {filteredOrders.map((order) => {
                  const itemSummary = order.items
                    ? order.items.map(item => `${item.product_name}${item.variant_name ? ` (${item.variant_name})` : ''} x${item.quantity}`).join(', ')
                    : ''
                  return (
                    <tr key={order.order_id} className="hover:bg-slate-50 transition">
                      <td className="px-3 md:px-4 py-3.5 text-center font-bold text-slate-800">#ORD-{order.order_id}</td>
                      <td className="px-3 md:px-4 py-3.5 whitespace-nowrap text-slate-500 font-mono hidden sm:table-cell">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-3 md:px-4 py-3.5 font-bold text-slate-800 max-w-[100px] sm:max-w-[140px] truncate" title={order.customer_name || 'Guest'}>{order.customer_name || 'Guest'}</td>
                      <td className="px-3 md:px-4 py-3.5 whitespace-nowrap text-slate-600 font-medium hidden md:table-cell">{order.phone}</td>
                      <td className="px-3 md:px-4 py-3.5 max-w-[200px] truncate text-slate-500 hidden lg:table-cell" title={itemSummary}>{itemSummary}</td>
                      <td className="px-3 md:px-4 py-3.5 text-right font-medium hidden sm:table-cell">৳{parseFloat(order.subtotal_amount).toFixed(2)}</td>
                      <td className="px-3 md:px-4 py-3.5 text-right font-medium text-[#BD4444] hidden md:table-cell">-৳{parseFloat(order.total_discount_amount || 0).toFixed(2)}</td>
                      <td className="px-3 md:px-4 py-3.5 text-right font-bold text-[#73976A]">৳{parseFloat(order.total_amount).toFixed(2)}</td>
                      <td className="px-3 md:px-4 py-3.5 text-center">
                        <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'delivered' ? 'bg-[#73976A]/10 text-[#73976A] border border-[#73976A]/20' :
                          ['cancelled', 'failed'].includes(order.status) ? 'bg-[#BD4444]/10 text-[#BD4444] border border-[#BD4444]/20' :
                          order.status === 'returned' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-3 md:px-4 py-3.5 text-center">
                        <Link
                          href={`/dashboard/sales/sale/${order.order_id}`}
                          className="px-2.5 sm:px-3 py-1 bg-[#73976A] hover:bg-[#607E59] text-white rounded-lg text-[10px] font-bold transition inline-block cursor-pointer shadow-xs"
                        >
                          Invoice
                        </Link>
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

