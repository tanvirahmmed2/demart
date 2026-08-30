'use client'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Context } from '@/component/helper/Context'
import RichTextEditor from '@/component/helper/RichTextEditor'
import { STORE_TAGLINE } from '@/lib/secret'
import { 
  BiEnvelope, 
  BiPhoneCall, 
  BiMap, 
  BiSend, 
  BiTimeFive, 
  BiLoaderAlt 
} from 'react-icons/bi'

export default function ContactPage() {
  const { website } = useContext(Context)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const cleanMsg = message ? message.replace(/<[^>]*>/g, '').trim() : '';
    if (!name.trim() || !email.trim() || !subject.trim() || !cleanMsg) {
      toast.error('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    try {
      await axios.post('/api/contact', {
        name,
        email,
        subject,
        message
      })
      toast.success('Inquiry submitted successfully! We will get back to you via email shortly.')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit contact form.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full min-h-screen  py-24 p-4 md:p-10">
      <div className=" flex flex-col gap-12">
        
        <div className="text-center flex flex-col gap-3 max-w-2xl mx-auto">
          <h1 className="text-4xl font-semibold text-slate-900 tracking-tight sm:text-5xl">
            Get in Touch
          </h1>
          <p className="text-slate-500 text-base sm:text-lg">
            {STORE_TAGLINE}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch w-full">
          
          <div className="lg:col-span-2 flex flex-col gap-6 justify-between bg-secondary text-tertiary rounded-3xl p-8 shadow-xl shadow-slate-950/20 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-light/10 rounded-full blur-3xl" />
            
            <div className="flex flex-col gap-8 relative z-10">
              <div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Contact Information</h2>
                <p className="text-tertiary text-sm mt-1.5 leading-relaxed">
                  Reach out to us directly or visit our showrooms. We are always ready to help.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-800 rounded-2xl text-emerald-450 border border-slate-700/50 shrink-0 text-xl text-primary-light">
                    <BiPhoneCall />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-tertiary uppercase tracking-widest">Customer Helpline</h4>
                    <p className="text-tertiary text-sm font-semibold mt-1">{website?.phone || '+880 1234-567890'}</p>
                    <p className="text-slate-450 text-xxs mt-0.5">Support Hours: 9 AM - 6 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-800 rounded-2xl text-emerald-450 border border-slate-700/50 shrink-0 text-xl text-primary-light">
                    <BiEnvelope />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-tertiary uppercase tracking-widest">Email Address</h4>
                    <p className="text-tertiary text-sm font-semibold mt-1">{website?.email || 'support@ecommerce.com'}</p>
                    <p className="text-slate-450 text-xxs mt-0.5">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-800 rounded-2xl text-emerald-450 border border-slate-700/50 shrink-0 text-xl text-primary-light">
                    <BiMap />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-tertiary uppercase tracking-widest">Office Showroom</h4>
                    <p className="text-tertiary text-sm font-semibold mt-1 leading-relaxed">
                      {website?.address || <>123 Commercial Plaza, 4th Floor,<br />Dhaka, Bangladesh</>}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/30 p-5 rounded-2xl mt-6 relative z-10 flex gap-3.5 items-start">
              <BiTimeFive className="text-2xl text-primary-light shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-semibold text-slate-200">Support Availability</h5>
                <p className="text-xs text-tertiary mt-1 leading-relaxed">
                  Our online manager dashboard monitors incoming contact forms 24/7. Official response dispatch runs Saturday to Thursday.
                </p>
              </div>
            </div>

          </div>

          <div className="lg:col-span-3 bg-white border border-slate-100 shadow-md rounded-3xl p-6 md:p-10 flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-slate-850 border-b border-slate-50 pb-3">Submit an Inquiry</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase">Your Name <span className="text-red-500">*</span></label>
                  <input className="input-style"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase">Email Address <span className="text-red-500">*</span></label>
                  <input className="input-style"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase">Subject <span className="text-red-500">*</span></label>
                <input className="input-style"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase">Detailed Message <span className="text-red-500">*</span></label>
                <RichTextEditor value={message} onChange={setMessage} />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3 bg-primary hover:bg-primary-light text-white rounded-xl text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-primary/10 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <BiLoaderAlt className="animate-spin text-lg" />
                    Submitting Inquiry...
                  </>
                ) : (
                  <>
                    <BiSend className="text-lg" /> Send Message
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  )
}
