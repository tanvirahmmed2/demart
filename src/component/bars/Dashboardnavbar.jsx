'use client'
import React, { useContext } from 'react'
import { BiMenu, BiShieldAlt2, BiHomeAlt } from 'react-icons/bi'
import { Context } from '../helper/Context'
import Link from 'next/link'

const Dashboardnavbar = () => {
  const { user, dashSidebar, setDashSidebar } = useContext(Context)

  return (
    <header 
      className="w-full h-14 fixed top-0 z-40 bg-primary text-white flex items-center justify-between px-4 border-b border-black/10 shadow-md"
    >
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setDashSidebar(!dashSidebar)}
          className="p-1.5 rounded-xl text-white hover:bg-black/10 transition cursor-pointer"
          title="Toggle Navigation Sidebar"
        >
          <BiMenu className="text-2xl" />
        </button> 
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-sm tracking-tight text-white hover:opacity-90 transition">
          <span className="font-semibold tracking-tight">Management Console</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-white hover:bg-black/10 border border-white/20 transition cursor-pointer">
          <BiHomeAlt className="text-sm text-white" /> Store
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white hidden md:inline">{user?.name}</span>
        </div>
      </div>
    </header>
  )
}

export default Dashboardnavbar