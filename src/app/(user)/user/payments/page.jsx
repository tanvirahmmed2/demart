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
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-2 sm:px-4 md:px-8 transition-all duration-300 ${userSidebar ? 'lg:pl-60' : 'lg:pl-8'}`}>
      <div className="w-full flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <BiDollarCircle className="text-primary text-2xl" />
              Payments Log
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Check settlement records, transaction methods, and receipt history.</p>
          </div>
          <Link href="/user" className="px-4 py-2 border border-slate-200 text-slate-700 bg-white text-xs font-bold hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 shadow-sm">
            <BiArrowBack /> Back to Profile
          </Link>
        </div>

        {/* Payments list */}
        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-2">
            <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
            <p className="text-slate-500 text-xs font-semibold animate-pulse">Loading payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="w-full bg-white border border-slate-200 py-16 px-6 text-center flex flex-col items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-primary text-white flex items-center justify-center text-2xl font-bold">
              <BiDollarCircle />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">No Payments Recorded</h3>
              <p className="text-slate-500 text-xs mt-1 max-w-sm leading-relaxed">You don't have any payment settlements recorded in your logs yet.</p>
            </div>
          </div>
        ) : (
          <div className="w-full bg-white border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-650 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-3 md:px-4 py-3 text-center">Receipt ID</th>
                  <th className="hidden md:table-cell px-3 md:px-4 py-3">Settled Date</th>
                  <th className="px-3 md:px-4 py-3 text-center">Order Ref</th>
                  <th className="hidden lg:table-cell px-3 md:px-4 py-3">Product Item</th>
                  <th className="hidden sm:table-cell px-3 md:px-4 py-3 text-center">Method</th>
                  <th className="px-3 md:px-4 py-3 text-right">Settled Amount</th>
                  <th className="hidden sm:table-cell px-3 md:px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {payments.map((pay) => (
                  <tr key={pay.payment_id} className="hover:bg-slate-50 transition">
                    <td className="px-3 md:px-4 py-3.5 text-center font-bold text-slate-500 font-mono">#PAY-{pay.payment_id}</td>
                    <td className="hidden md:table-cell px-3 md:px-4 py-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">{new Date(pay.paid_at).toLocaleString()}</td>
                    <td className="px-3 md:px-4 py-3.5 text-center font-bold font-mono text-primary">
                      <Link href={`/track-order?id=${pay.order_id}`} className="hover:underline cursor-pointer">
                        #ORD-{pay.order_id}
                      </Link>
                    </td>
                    <td className="hidden lg:table-cell px-3 md:px-4 py-3.5 font-medium text-slate-700 max-w-[160px] truncate" title={pay.sample_product_name || 'In-store Items'}>{pay.sample_product_name || 'In-store Items'}</td>
                    <td className="hidden sm:table-cell px-3 md:px-4 py-3.5 text-center">
                      <span className="px-1.5 py-0.5 uppercase text-[9px] font-bold border bg-slate-100 text-slate-700 border-slate-200">
                        {pay.payment_method}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-3.5 text-right font-bold text-emerald-600">৳{parseFloat(pay.amount).toFixed(2)}</td>
                    <td className="hidden sm:table-cell px-3 md:px-4 py-3.5 text-center">
                      <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase border bg-emerald-50 text-emerald-700 border-emerald-200">
                        {pay.payment_status}
                      </span>
                    </td>
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


