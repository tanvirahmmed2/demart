'use client'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Context } from '@/component/helper/Context'
import { 
  BiDollarCircle, 
  BiCart, 
  BiUserCheck, 
  BiPackage, 
  BiShieldQuarter,
  BiTrendingUp,
  BiStoreAlt,
  BiRefresh,
  BiChevronRight,
  BiCog,
  BiLoaderAlt,
  BiTimeFive,
  BiCheckCircle
} from 'react-icons/bi'

export default function AdminOverviewPage() {
  const { dashSidebar, user, loading: userLoading } = useContext(Context)
  
  const [stats, setStats] = useState({
    staff: 0,
    customers: 0,
    products: 0,
    totalStock: 0,
    stockValue: 0,
    stockCost: 0,
    orders: 0,
    revenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    categories: 0,
    brands: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      const [statsRes, salesRes] = await Promise.all([
        axios.get('/api/dashboard/stats'),
        axios.get('/api/sale')
      ])
      setStats(statsRes.data)
      setRecentOrders(salesRes.data.slice(0, 5))
    } catch (err) {
      console.error('Error fetching admin overview data:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (userLoading) return
    if (user && user.role === 'admin') {
      fetchData()
    }
  }, [user, userLoading])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  if (userLoading || (loading && !user)) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#F1F5F9]">
        <div className="flex flex-col items-center gap-3">
          <BiLoaderAlt className="animate-spin text-4xl text-[#73976A]" />
          <p className="text-slate-600 text-sm font-semibold animate-pulse">Loading overview...</p>
        </div>
      </div>
    )
  }

  const isAdmin = user && user.role === 'admin'
  if (!isAdmin) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#F1F5F9]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 flex flex-col gap-4 text-center">
          <BiShieldQuarter className="text-5xl text-[#BD4444] mx-auto" />
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Access Denied</h1>
          <p className="text-slate-600 text-xs md:text-sm">Please sign in with an Administrator account to view this page.</p>
          <Link href="/login" className="mt-2 px-6 py-2.5 bg-[#73976A] hover:bg-[#607E59] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full min-h-screen bg-[#F1F5F9] pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-64' : 'lg:pl-8'}`}>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Admin Overview</h1>
            <p className="text-xs text-slate-500 mt-1">Simple key indicators: Staff, Products, Sales, Stock, Stock Price, Total Orders, Pending Orders, and Completed Orders.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition cursor-pointer shadow-xs disabled:opacity-50"
              title="Refresh Stats"
            >
              <BiRefresh className={`text-xl ${refreshing ? 'animate-spin text-[#73976A]' : ''}`} />
            </button>
            <Link 
              href="/dashboard/admin/settings"
              className="px-4 py-2.5 bg-[#73976A] hover:bg-[#607E59] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <BiCog className="text-base" /> Store Settings
            </Link>
          </div>
        </div>

        {/* 8 Clean Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          
          {/* Card 1: Total Staff */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Staff</p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">{stats.staff} Members</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Admins, Managers & Sales</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#73976A]/10 text-[#73976A] border border-[#73976A]/20 flex items-center justify-center text-2xl shrink-0">
              <BiUserCheck />
            </div>
          </div>

          {/* Card 2: Total Product */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Product</p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">{stats.products} Products</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">{stats.categories} Categories / {stats.brands} Brands</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center text-2xl shrink-0">
              <BiStoreAlt />
            </div>
          </div>

          {/* Card 3: Total Sales */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Sales</p>
              <h2 className="text-2xl font-bold text-[#73976A] mt-1">
                ৳{stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Settled Gross Earnings</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#73976A]/10 text-[#73976A] border border-[#73976A]/20 flex items-center justify-center text-2xl shrink-0">
              <BiDollarCircle />
            </div>
          </div>

          {/* Card 4: Total Stock */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Stock</p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">{stats.totalStock.toLocaleString()} Units</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Physical Inventory Count</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center text-2xl shrink-0">
              <BiPackage />
            </div>
          </div>

          {/* Card 5: Total Stock Price */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Stock Price</p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">
                ৳{stats.stockValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Retail Inventory Value</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#73976A]/10 text-[#73976A] border border-[#73976A]/20 flex items-center justify-center text-2xl shrink-0">
              <BiTrendingUp />
            </div>
          </div>

          {/* Card 6: Total Order */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Order</p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">{stats.orders} Orders</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">All Time Orders Logged</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center text-2xl shrink-0">
              <BiCart />
            </div>
          </div>

          {/* Card 7: Pending Order */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pending Order</p>
              <h2 className="text-2xl font-bold text-amber-700 mt-1">{stats.pendingOrders} Orders</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Awaiting Processing</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center text-2xl shrink-0">
              <BiTimeFive />
            </div>
          </div>

          {/* Card 8: Completed Order */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Completed Order</p>
              <h2 className="text-2xl font-bold text-[#73976A] mt-1">{stats.completedOrders} Orders</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Delivered Successfully</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#73976A]/10 text-[#73976A] border border-[#73976A]/20 flex items-center justify-center text-2xl shrink-0">
              <BiCheckCircle />
            </div>
          </div>

        </div>

        {/* Quick Navigation and Recent Orders Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Orders Panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800">Recent Customer Orders</h3>
              <Link href="/dashboard/admin/sales" className="text-xs font-bold text-[#73976A] hover:text-[#607E59] flex items-center gap-0.5 transition">
                View Sales Desk <BiChevronRight className="text-base" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No recent orders recorded.</p>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#F1F5F9] text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-2.5 sm:px-3 py-2.5 text-center">ID</th>
                      <th className="px-2.5 sm:px-3 py-2.5">Customer</th>
                      <th className="px-2.5 sm:px-3 py-2.5 hidden sm:table-cell">Phone</th>
                      <th className="px-2.5 sm:px-3 py-2.5 text-right">Amount</th>
                      <th className="px-2.5 sm:px-3 py-2.5 text-center">Status</th>
                      <th className="px-2.5 sm:px-3 py-2.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {recentOrders.map(order => (
                      <tr key={order.order_id} className="hover:bg-slate-50 transition">
                        <td className="px-2.5 sm:px-3 py-2.5 text-center font-bold text-slate-800">#ORD-{order.order_id}</td>
                        <td className="px-2.5 sm:px-3 py-2.5 font-semibold text-slate-800 max-w-[100px] sm:max-w-[140px] truncate">{order.customer_name || 'Guest'}</td>
                        <td className="px-2.5 sm:px-3 py-2.5 font-medium text-slate-500 hidden sm:table-cell">{order.phone}</td>
                        <td className="px-2.5 sm:px-3 py-2.5 text-right font-bold text-slate-900">৳{parseFloat(order.total_amount).toFixed(2)}</td>
                        <td className="px-2.5 sm:px-3 py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'delivered' ? 'bg-[#73976A]/10 text-[#73976A] border border-[#73976A]/20' :
                            ['cancelled', 'failed'].includes(order.status) ? 'bg-[#BD4444]/10 text-[#BD4444] border border-[#BD4444]/20' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-2.5 sm:px-3 py-2.5 text-center">
                          <Link href={`/dashboard/sales/sale/${order.order_id}`} className="px-2.5 py-1 bg-[#73976A] hover:bg-[#607E59] text-white rounded-lg text-[10px] font-bold transition cursor-pointer">
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Access Menu */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5">
              Quick Admin Actions
            </h3>
            
            <div className="grid grid-cols-1 gap-2.5">
              <Link href="/dashboard/admin/people" className="p-3 bg-[#F1F5F9] hover:bg-slate-200/60 border border-slate-200 rounded-xl transition font-bold text-xs text-slate-700 flex items-center justify-between group">
                <span className="group-hover:text-[#73976A] transition-colors">Accounts & Staff Roles</span>
                <BiChevronRight className="text-base text-slate-400 group-hover:text-[#73976A]" />
              </Link>
              <Link href="/dashboard/admin/stock" className="p-3 bg-[#F1F5F9] hover:bg-slate-200/60 border border-slate-200 rounded-xl transition font-bold text-xs text-slate-700 flex items-center justify-between group">
                <span className="group-hover:text-[#73976A] transition-colors">Warehouse Stock Inventory</span>
                <BiChevronRight className="text-base text-slate-400 group-hover:text-[#73976A]" />
              </Link>
              <Link href="/dashboard/admin/sales" className="p-3 bg-[#F1F5F9] hover:bg-slate-200/60 border border-slate-200 rounded-xl transition font-bold text-xs text-slate-700 flex items-center justify-between group">
                <span className="group-hover:text-[#73976A] transition-colors">Global Sales Desk</span>
                <BiChevronRight className="text-base text-slate-400 group-hover:text-[#73976A]" />
              </Link>
              <Link href="/dashboard/admin/payments" className="p-3 bg-[#F1F5F9] hover:bg-slate-200/60 border border-slate-200 rounded-xl transition font-bold text-xs text-slate-700 flex items-center justify-between group">
                <span className="group-hover:text-[#73976A] transition-colors">Payments Audit Ledger</span>
                <BiChevronRight className="text-base text-slate-400 group-hover:text-[#73976A]" />
              </Link>
              <Link href="/dashboard/admin/report" className="p-3 bg-[#F1F5F9] hover:bg-slate-200/60 border border-slate-200 rounded-xl transition font-bold text-xs text-slate-700 flex items-center justify-between group">
                <span className="group-hover:text-[#73976A] transition-colors">Analytics Reports & Trends</span>
                <BiChevronRight className="text-base text-slate-400 group-hover:text-[#73976A]" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

