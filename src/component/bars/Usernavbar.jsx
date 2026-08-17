'use client'
import React, { useContext } from 'react'
import { BiMenu, BiShieldAlt2, BiStoreAlt, BiLayout } from 'react-icons/bi'
import { Context } from '../helper/Context'
import Link from 'next/link'

const Usernavbar = () => {
  const { user, userSidebar, setUserSidebar } = useContext(Context)
  const isStaff = user && ['admin', 'manager', 'sales'].includes(user.role)

  return (
    <header 
      className="w-full h-14 fixed top-0 z-40 bg-primary text-white flex items-center justify-between px-4 border-b border-black/10 shadow-md"
    >
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setUserSidebar(!userSidebar)} 
          className="p-1.5 text-white hover:bg-black/10 transition cursor-pointer"
          title="Toggle Navigation Sidebar"
        >
          <BiMenu className="text-2xl" />
        </button>
        <Link href="/user" className="flex items-center gap-2 font-bold text-sm tracking-tight text-white hover:opacity-90 transition">
          <span className="font-semibold tracking-tight">Customer Portal</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {isStaff && (
          <Link 
            href={`/dashboard/${user.role}`} 
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-white bg-black/20 hover:bg-black/35 border border-white/30 transition cursor-pointer shadow-sm"
          >
            <BiLayout className="text-sm text-white" /> Dashboard
          </Link>
        )}

        <Link href="/" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white hover:bg-black/10 border border-white/20 transition cursor-pointer">
          <BiStoreAlt className="text-sm text-white" /> Shop Home
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white hidden md:inline">{user?.name}</span>
        </div>
      </div>
    </header>
  )
}

export default Usernavbar