'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BiHistory, 
  BiDollarCircle, 
  BiUserVoice, 
  BiSupport, 
  BiHome, 
  BiCog, 
  BiLogOut, 
  BiChevronRight 
} from 'react-icons/bi'

const Usersidebar = () => {
    const { userSidebar, logout, website } = useContext(Context)
    const themeColor = website?.theme_color || '#73976A'
    const pathname = usePathname()

    const isActive = (path) => pathname === path

    const links = [
      { name: 'History', path: '/user/history', icon: <BiHistory /> },
      { name: 'Payments', path: '/user/payments', icon: <BiDollarCircle /> },
      { name: 'Reviews', path: '/user/reviews', icon: <BiUserVoice /> },
      { name: 'Support', path: '/user/support', icon: <BiSupport /> },
    ]

    const secondaryLinks = [
      { name: 'Shop Home', path: '/', icon: <BiHome /> },
      { name: 'Settings', path: '/user/settings', icon: <BiCog /> },
    ]

    return (
        <aside 
          className={`${userSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out w-56 h-[calc(100vh-3.5rem)] fixed top-14 left-0 text-white flex flex-col justify-between p-4 z-30 shadow-xl border-r border-black/10`}
          style={{ backgroundColor: themeColor }}
        >
            
            <div className="w-full flex flex-col gap-1.5 overflow-y-auto">
                <div className="px-3 py-2 text-xxs font-extrabold text-white/70 uppercase tracking-widest flex items-center justify-between">
                  <span>User Menu</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {links.map((link) => {
                  const active = isActive(link.path)
                  return (
                    <Link 
                      key={link.path}
                      href={link.path} 
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        active 
                          ? 'bg-black/25 text-white shadow-sm border border-white/30' 
                          : 'text-white/90 hover:bg-black/15 hover:text-white border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base text-white">{link.icon}</span>
                        <span>{link.name}</span>
                      </div>
                      <BiChevronRight className={`text-xs transition ${active ? 'text-white translate-x-0.5' : 'text-white/60'}`} />
                    </Link>
                  )
                })}
            </div>

            {/* Bottom Links & Logout */}
            <div className="w-full pt-3 mt-2 border-t border-white/20 flex flex-col gap-1.5 shrink-0">
                {secondaryLinks.map((link) => {
                  const active = isActive(link.path)
                  return (
                    <Link 
                      key={link.path}
                      href={link.path}
                      className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                        active 
                          ? 'bg-black/25 text-white border border-white/30' 
                          : 'text-white/80 hover:bg-black/15 hover:text-white'
                      }`}
                    >
                      <span className="text-base text-white">{link.icon}</span>
                      <span>{link.name}</span>
                    </Link>
                  )
                })}

                <button 
                  onClick={() => logout()} 
                  className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-left hover:bg-black/20 text-white/80 hover:text-white transition cursor-pointer"
                >
                    <BiLogOut className="text-base text-white" />
                    <span>Sign Out</span>
                </button>
            </div>

        </aside>
    )
}

export default Usersidebar