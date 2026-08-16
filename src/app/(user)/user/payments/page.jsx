'use client'
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '@/component/helper/Context'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  BiDollarCircle, 
  BiLoaderAlt,
  BiArrowBack
} from 'react-icons/bi'

export default function UserPaymentsPage() {
  const { userSidebar } = useContext(Context)

  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true)
      try {
        const res = await axios.get('/api/sale/payments')
        setPayments(res.data)
      } catch (err) {
        console.error('Failed to load user payments:', err)
        toast.error('Failed to fetch payments logs')
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  return (
    <div className={`w-full min-h-screen bg-[#F1F5F9] pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${userSidebar ? 'lg:pl-60' : 'lg:pl-8'}`}>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <BiDollarCircle className="text-[#73976A] text-2xl" />
              Payments Log
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Check settlement records, transaction methods, and receipt history.</p>
          </div>
          <Link href="/user" className="px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-xl text-xs font-bold hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 shadow-2xs">
            <BiArrowBack /> Back to Profile
          </Link>
        </div>

        {/* Payments list */}
        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-2">
            <BiLoaderAlt className="animate-spin text-4xl text-[#73976A]" />
            <p className="text-slate-500 text-xs font-semibold animate-pulse">Loading payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="w-full bg-white border border-slate-200 rounded-2xl py-16 px-6 text-center flex flex-col items-center gap-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#73976A]/10 flex items-center justify-center text-[#73976A] text-3xl border border-[#73976A]/20">
              <BiDollarCircle />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">No Payments Recorded</h3>
              <p className="text-slate-500 text-xs mt-1 max-w-sm leading-relaxed">You don't have any payment settlements recorded in your logs yet.</p>
            </div>
          </div>
        ) : (
          <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-3 py-3 text-center">Receipt ID</th>
                  <th className="px-3 py-3 hidden md:table-cell">Settled Date</th>
                  <th className="px-3 py-3 text-center">Order Ref</th>
                  <th className="px-3 py-3 hidden lg:table-cell">Product Item</th>
                  <th className="px-3 py-3 text-center hidden sm:table-cell">Method</th>
                  <th className="px-3 py-3 text-right">Settled Amount</th>
                  <th className="px-3 py-3 text-center">Status</th>
                  <th className="px-3 py-3 hidden xl:table-cell">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {payments.map((pay) => (
                  <tr key={pay.payment_id} className="hover:bg-slate-50/70 transition">
                    <td className="px-3 py-3.5 text-center font-bold text-slate-500 font-mono">#PAY-{pay.payment_id}</td>
                    <td className="px-3 py-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px] hidden md:table-cell">{new Date(pay.paid_at).toLocaleString()}</td>
                    <td className="px-3 py-3.5 text-center font-bold text-[#73976A] font-mono">
                      <Link href={`/track-order?id=${pay.order_id}`} className="hover:underline cursor-pointer">
                        #ORD-{pay.order_id}
                      </Link>
                    </td>
                    <td className="px-3 py-3.5 font-medium text-slate-700 max-w-[160px] truncate hidden lg:table-cell" title={pay.sample_product_name || 'In-store Items'}>{pay.sample_product_name || 'In-store Items'}</td>
                    <td className="px-3 py-3.5 text-center hidden sm:table-cell">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold uppercase text-[10px] border border-slate-200">
                        {pay.payment_method}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-right font-black text-[#73976A]">৳{parseFloat(pay.amount).toFixed(2)}</td>
                    <td className="px-3 py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#73976A]/10 text-[#73976A] border border-[#73976A]/20">
                        {pay.payment_status}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-slate-500 italic max-w-[150px] truncate hidden xl:table-cell" title={pay.note}>{pay.note ? `"${pay.note}"` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

