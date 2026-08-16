'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BiCategory, 
  BiTag, 
  BiPackage, 
  BiMessageSquareDetail, 
  BiLogOut, 
  BiChevronRight,
  BiHome,
  BiUser,
  BiDollarCircle,
  BiFile,
  BiCog,
  BiUserVoice,
  BiCart,
  BiHistory,
  BiArrowBack,
  BiTime,
  BiCheckCircle,
  BiStoreAlt,
  BiSolidTruck
} from 'react-icons/bi'

const Dashboardsidebar = () => {
    const { dashSidebar, logout, user } = useContext(Context)
    const pathname = usePathname()

    const isActive = (path) => pathname === path || pathname.startsWith(path + '/')

    const adminLinks = [
      { name: 'Overview', path: '/dashboard/admin/overview', icon: <BiHome /> },
      { name: 'People (Accounts)', path: '/dashboard/admin/people', icon: <BiUser /> },
      { name: 'Sales', path: '/dashboard/admin/sales', icon: <BiDollarCircle /> },
      { name: 'Stock', path: '/dashboard/admin/stock', icon: <BiPackage /> },
      { name: 'Payments', path: '/dashboard/admin/payments', icon: <BiDollarCircle /> },
      { name: 'Reviews', path: '/dashboard/admin/reviews', icon: <BiUserVoice /> },
      { name: 'Issue Log', path: '/dashboard/admin/issue', icon: <BiMessageSquareDetail /> },
      { name: 'Reports', path: '/dashboard/admin/report', icon: <BiFile /> },
      { name: 'Settings', path: '/dashboard/admin/settings', icon: <BiCog /> },
    ]

    const managerLinks = [
      { name: 'Overview', path: '/dashboard/manager/overview', icon: <BiHome /> },
      { name: 'Categories', path: '/dashboard/manager/category', icon: <BiCategory /> },
      { name: 'Brands', path: '/dashboard/manager/brands', icon: <BiTag /> },
      { name: 'Products', path: '/dashboard/manager/product', icon: <BiPackage /> },
      { name: 'Issues', path: '/dashboard/manager/issues', icon: <BiMessageSquareDetail /> },
      { name: 'Purchases', path: '/dashboard/manager/purchase', icon: <BiDollarCircle /> },
      { name: 'Sales', path: '/dashboard/manager/sales', icon: <BiDollarCircle /> },
      { name: 'Stock', path: '/dashboard/manager/stock', icon: <BiPackage /> },
      { name: 'Suppliers', path: '/dashboard/manager/supplier', icon: <BiStoreAlt /> },
      { name: 'Customers', path: '/dashboard/manager/customers', icon: <BiUser /> },
      { name: 'Support Tickets', path: '/dashboard/manager/support', icon: <BiMessageSquareDetail /> },
      { name: 'Contact Messages', path: '/dashboard/manager/contact', icon: <BiMessageSquareDetail /> },
      { name: 'Reviews', path: '/dashboard/manager/reviews', icon: <BiUserVoice /> },
      { name: 'Payments', path: '/dashboard/manager/payments', icon: <BiDollarCircle /> },
      { name: 'Returns', path: '/dashboard/manager/return', icon: <BiArrowBack /> },
      { name: 'Reports', path: '/dashboard/manager/report', icon: <BiFile /> },
    ]

    const salesLinks = [
      { name: 'Create Sale', path: '/dashboard/sales/sale', icon: <BiCart /> },
      { name: 'Pending Sales', path: '/dashboard/sales/pending-sale', icon: <BiTime /> },
      { name: 'Confirmed Sales', path: '/dashboard/sales/confirmed-sale', icon: <BiCheckCircle /> },
      { name: 'Out for Delivery', path: '/dashboard/sales/out_for_delivery', icon: <BiSolidTruck /> },
      { name: 'Completed Sales', path: '/dashboard/sales/completed-sale', icon: <BiCheckCircle /> },
      { name: 'Payments', path: '/dashboard/sales/payments', icon: <BiDollarCircle /> },
      { name: 'History', path: '/dashboard/sales/history', icon: <BiHistory /> },
      { name: 'Report Issue', path: '/dashboard/sales/issue', icon: <BiMessageSquareDetail /> },
    ]

    let links = []
    if (user?.role === 'admin') {
      links = adminLinks
    } else if (user?.role === 'manager') {
      links = managerLinks
    } else if (user?.role === 'sales') {
      links = salesLinks
    }

    return (
        <aside className={`${dashSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out w-64 h-[calc(100vh-3.5rem)] fixed top-14 left-0 bg-slate-950 border-r border-slate-800/80 text-slate-300 flex flex-col justify-between p-4 z-30 shadow-xl`}>
            
            <div className="w-full flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1">
                

                {links.map((link) => {
                  const active = isActive(link.path)
                  return (
                    <Link 
                      key={link.path}
                      href={link.path} 
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        active 
                          ? 'bg-linear-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-950/40 border border-emerald-500/30' 
                          : 'text-slate-300 hover:bg-slate-900/90 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-base ${active ? 'text-white' : 'text-emerald-400'}`}>{link.icon}</span>
                        <span>{link.name}</span>
                      </div>
                      <BiChevronRight className={`text-xs transition ${active ? 'text-white translate-x-0.5' : 'text-slate-600'}`} />
                    </Link>
                  )
                })}
            </div>

            {/* Fixed footer logout section */}
            <div className="w-full pt-3 mt-2 border-t border-slate-800/80 flex flex-col gap-1.5 shrink-0">
                <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition">
                    <BiHome className="text-base text-emerald-400" />
                    <span>Shop Home</span>
                </Link>
                <button 
                  onClick={() => logout()} 
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-left hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                >
                    <BiLogOut className="text-base text-rose-500" />
                    <span>Sign Out</span>
                </button>
            </div>

        </aside>
    )
}

export default Dashboardsidebar