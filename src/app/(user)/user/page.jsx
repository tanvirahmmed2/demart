'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/component/helper/Context'
import { 
  BiHistory, 
  BiDollarCircle, 
  BiUserVoice, 
  BiSupport, 
  BiCog, 
  BiHome,
  BiChevronRight,
  BiUserCircle,
  BiLoaderAlt,
  BiPhone,
  BiCalendar,
  BiLogOut
} from 'react-icons/bi'

export default function UserPage() {
  const { user, loading, logout, userSidebar, website } = useContext(Context)
  const themeColor = website?.theme_color || '#73976A'

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
          <p className="text-slate-500 text-xs font-semibold animate-pulse">Loading user profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white border border-slate-200 p-6 md:p-8 flex flex-col gap-4 text-center shadow-sm">
          <BiUserCircle className="text-5xl text-rose-500 mx-auto" />
          <h1 className="text-xl font-bold text-slate-800">Access Denied</h1>
          <p className="text-slate-600 text-xs leading-relaxed">Please log in to access your account dashboard and user services.</p>
          <Link href="/login" className="mt-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer shadow-sm">
            Log In Now
          </Link>
        </div>
      </div>
    )
  }

  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'US'

  const userLinks = [
    {
      name: 'Order History',
      description: 'Review your past orders, delivery status, and print receipts.',
      path: '/user/history',
      icon: <BiHistory />
    },
    {
      name: 'Payments Log',
      description: 'Track payment transactions, settlement statuses, and invoice records.',
      path: '/user/payments',
      icon: <BiDollarCircle />
    },
    {
      name: 'My Reviews',
      description: 'Share feedback, post product reviews, and check moderation states.',
      path: '/user/reviews',
      icon: <BiUserVoice />
    },
    {
      name: 'Support Tickets',
      description: 'Create support inquiries and chat live with customer support staff.',
      path: '/user/support',
      icon: <BiSupport />
    },
    {
      name: 'Account Settings',
      description: 'Update your display name, contact phone number, and account information.',
      path: '/user/settings',
      icon: <BiCog />
    },
    {
      name: 'Back to Shop',
      description: 'Return to storefront homepage to discover new catalog items.',
      path: '/',
      icon: <BiHome />
    }
  ]

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${userSidebar ? 'lg:pl-60' : 'lg:pl-8'}`}>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
        
        {/* User Profile Banner */}
        <div className="bg-white border border-slate-200 shadow-sm p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-900 text-white text-xl font-bold flex items-center justify-center shadow-sm shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">{user.name}</h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <BiPhone className="text-slate-600 text-sm" />
              <span className="font-bold text-slate-700">Phone:</span> {user.phone || 'N/A'}
            </div>
            <div className="flex items-center gap-2">
              <BiCalendar className="text-slate-600 text-sm" />
              <span className="font-bold text-slate-700">Member Since:</span> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </div>
            <button 
              onClick={() => logout()}
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 transition cursor-pointer hover:underline"
            >
              <BiLogOut className="text-sm" /> Sign Out Account
            </button>
          </div>
        </div>

        {/* Modules Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">User Account Modules</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {userLinks.map((link) => (
              <Link 
                key={link.path}
                href={link.path}
                className="bg-white border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition group cursor-pointer"
              >
                <div>
                  <div className="w-10 h-10 flex items-center justify-center text-lg mb-3.5 text-white font-bold" style={{ backgroundColor: themeColor }}>
                    {link.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm transition-colors">{link.name}</h3>
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                    {link.description}
                  </p>
                </div>
                
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between font-bold text-xs" style={{ color: themeColor }}>
                  <span>Access Module</span>
                  <BiChevronRight className="text-base group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}


