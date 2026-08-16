'use client'
import React, { useContext } from 'react'
import { BiMenu, BiShieldAlt2, BiStoreAlt } from 'react-icons/bi'
import { Context } from '../helper/Context'
import Link from 'next/link'

const Usernavbar = () => {
  const { user, userSidebar, setUserSidebar } = useContext(Context)



  return (
    <header className="w-full h-14 bg-slate-950/95 backdrop-blur-md fixed top-0 z-40 text-white flex items-center justify-between px-4 border-b border-slate-800/80 shadow-md">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setUserSidebar(!userSidebar)} 
          className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
          title="Toggle Navigation Sidebar"
        >
          <BiMenu className="text-2xl" />
        </button>
        <Link href="/user" className="flex items-center gap-2 font-bold text-sm tracking-tight text-white hover:text-emerald-400 transition">
          
          <span className="font-semibold tracking-tight">Customer Portal</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition cursor-pointer">
          <BiStoreAlt className="text-sm text-emerald-400" /> Shop Home
        </Link>

       
        <div className="flex items-center gap-2">
          
          <span className="text-xs font-bold text-slate-200 hidden md:inline">{user?.name}</span>
        </div>
      </div>
    </header>
  )
}

export default Usernavbar