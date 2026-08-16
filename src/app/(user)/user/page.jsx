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
  const { user, loading, logout, userSidebar } = useContext(Context)

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#F1F5F9]">
        <div className="flex flex-col items-center gap-2">
          <BiLoaderAlt className="animate-spin text-4xl text-[#73976A]" />
          <p className="text-slate-500 text-xs font-semibold animate-pulse">Loading user profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#F1F5F9]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xs border border-slate-200 p-6 md:p-8 flex flex-col gap-4 text-center">
          <BiUserCircle className="text-5xl text-[#BD4444] mx-auto" />
          <h1 className="text-xl font-bold text-slate-800">Access Denied</h1>
          <p className="text-slate-600 text-xs leading-relaxed">Please log in to access your account dashboard and user services.</p>
          <Link href="/login" className="mt-2 px-6 py-2.5 bg-[#73976A] hover:bg-[#607E59] text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs">
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
      icon: <BiHistory />,
      color: 'bg-[#73976A]/10 text-[#73976A] border-[#73976A]/20 group-hover:bg-[#73976A] group-hover:text-white'
    },
    {
      name: 'Payments Log',
      description: 'Track payment transactions, settlement statuses, and invoice records.',
      path: '/user/payments',
      icon: <BiDollarCircle />,
      color: 'bg-teal-50 text-teal-700 border-teal-200 group-hover:bg-[#73976A] group-hover:text-white'
    },
    {
      name: 'My Reviews',
      description: 'Share feedback, post product reviews, and check moderation states.',
      path: '/user/reviews',
      icon: <BiUserVoice />,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200 group-hover:bg-[#73976A] group-hover:text-white'
    },
    {
      name: 'Support Tickets',
      description: 'Create support inquiries and chat live with customer support staff.',
      path: '/user/support',
      icon: <BiSupport />,
      color: 'bg-sky-50 text-sky-700 border-sky-200 group-hover:bg-[#73976A] group-hover:text-white'
    },
    {
      name: 'Account Settings',
      description: 'Update your display name, contact phone number, and account information.',
      path: '/user/settings',
      icon: <BiCog />,
      color: 'bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-[#73976A] group-hover:text-white'
    },
    {
      name: 'Back to Shop',
      description: 'Return to storefront homepage to discover new catalog items.',
      path: '/',
      icon: <BiHome />,
      color: 'bg-slate-100 text-slate-700 border-slate-200 group-hover:bg-slate-800 group-hover:text-white'
    }
  ]

  return (
    <div className={`w-full min-h-screen bg-[#F1F5F9] pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${userSidebar ? 'lg:pl-60' : 'lg:pl-8'}`}>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
        
        {/* User Profile Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#73976A] text-white text-xl font-bold flex items-center justify-center shadow-xs shrink-0 border border-[#607E59]">
              {initials}
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">{user.name}</h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <BiPhone className="text-[#73976A] text-sm" />
              <span className="font-bold text-slate-700">Phone:</span> {user.phone || 'N/A'}
            </div>
            <div className="flex items-center gap-2">
              <BiCalendar className="text-[#73976A] text-sm" />
              <span className="font-bold text-slate-700">Member Since:</span> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </div>
            <button 
              onClick={() => logout()}
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#BD4444] hover:text-[#842f2f] transition cursor-pointer hover:underline"
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
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg mb-3.5 transition-colors duration-200 ${link.color}`}>
                    {link.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-[#73976A] transition-colors">{link.name}</h3>
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                    {link.description}
                  </p>
                </div>
                
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-slate-700 font-bold text-xs group-hover:text-[#73976A]">
                  <span>Access Module</span>
                  <BiChevronRight className="text-base group-hover:translate-x-1 transition-transform text-[#73976A]" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

