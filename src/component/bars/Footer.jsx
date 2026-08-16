'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { FaLocationArrow } from 'react-icons/fa6'
import { Context } from '../helper/Context'
import { BiEnvelope, BiPhoneCall } from 'react-icons/bi'
import { STORE_NAME, STORE_TAGLINE } from '@/lib/secret'

const Footer = () => {
  const { website } = useContext(Context)

  return (
    <footer className='w-full p-8 bg-secondary text-tertiary-light flex flex-col items-center justify-center gap-8 border-t border-slate-800 print:hidden'>
      <div className='w-full flex flex-col md:flex-row items-start justify-between gap-8'>
        
        <div className='flex flex-col gap-3 max-w-sm'>
          <Link href={'/'} className='flex items-center gap-2 text-3xl font-extrabold text-white tracking-tight hover:opacity-90 transition'>
            <span>{STORE_NAME}</span>
          </Link>
          <p className='text-sm text-slate-450 italic '>
            {STORE_TAGLINE}
          </p>
          <div className="flex flex-col gap-2 text-xs  mt-2">
            {website?.address ? (
              <p className='flex flex-row gap-2 items-start leading-relaxed'>
                <FaLocationArrow className="mt-0.5  shrink-0" /> 
                <span>{website.address}</span>
              </p>
            ) : (
              <p className='flex flex-row gap-2 items-center'>
                <FaLocationArrow className=" shrink-0" /> 
                <span>Sadar, Mymensingh</span>
              </p>
            )}

            {website?.phone && (
              <p className='flex flex-row gap-2 items-center'>
                <BiPhoneCall className="text-lg  shrink-0" /> 
                <a href={`tel:${website.phone}`} className="hover:text-emerald-450 hover:text-emerald-400 transition">{website.phone}</a>
              </p>
            )}

            {website?.email && (
              <p className='flex flex-row gap-2 items-center'>
                <BiEnvelope className="text-lg  shrink-0" /> 
                <a href={`mailto:${website.email}`} className="hover:text-emerald-450 hover:text-emerald-400 transition">{website.email}</a>
              </p>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-2 text-sm'>
          <h4 className="text-xs font-bold  uppercase tracking-widest mb-1">Navigation</h4>
          <Link href={'/offers'} className="hover:text-white transition">Offers</Link>
          <Link href={'/track-order'} className="hover:text-white transition">Track Order</Link>
          <Link href={'/products/category'} className="hover:text-white transition">Category</Link>
          <Link href={'/reviews'} className="hover:text-white transition">Reviews</Link>
        </div>

        <div className='flex flex-col gap-2 text-sm'>
          <h4 className="text-xs font-bold  uppercase tracking-widest mb-1">Company</h4>
          <Link href={'/privacy-policy'} className="hover:text-white transition">Privacy & Policy</Link>
          <Link href={'/register'} className="hover:text-white transition">Register</Link>
          <Link href={'/about'} className="hover:text-white transition">About</Link>
          <Link href={'/contact'} className="hover:text-white transition">Contact Us</Link>
        </div>

      </div>

      <div className='w-full  border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs  gap-4'>
        <p>All rights are reserved by <Link href={'/'} className="hover:text-slate-350 hover:text-slate-300 font-semibold">{STORE_NAME}</Link> &copy; {new Date().getFullYear()}</p>
        <p>Developed by <Link href={'https://disibin.com'} target="_blank" className="hover:text-slate-350 hover:text-slate-300 font-semibold transition">Disibin</Link></p>
      </div>
    </footer>
  )
}

export default Footer