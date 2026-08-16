'use client'
import React, { useContext, useEffect, useState, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Context } from '@/component/helper/Context'
import RichTextEditor from '@/component/helper/RichTextEditor'
import { 
  BiMessageSquareDetail, 
  BiSend, 
  BiLoaderAlt, 
  BiCheckCircle, 
  BiTime, 
  BiChevronRight,
  BiPlus,
  BiRefresh,
  BiSupport,
  BiX,
  BiInfoCircle,
  BiArrowBack
} from 'react-icons/bi'

export default function UserSupportPage() {
  const { user, loading: userLoading, userSidebar } = useContext(Context)
  const [tickets, setTickets] = useState([])
  const [activeTicket, setActiveTicket] = useState(null)
  const [ticketsLoading, setTicketsLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  
  // Create ticket states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newSubject, setNewSubject] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [submittingTicket, setSubmittingTicket] = useState(false)

  // Reply state
  const [replyMessage, setReplyMessage] = useState('')
  const [submittingMessage, setSubmittingMessage] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const messagesEndRef = useRef(null)

  const fetchTickets = async (silent = false) => {
    if (!silent) setTicketsLoading(true)
    try {
      const res = await axios.get('/api/support')
      setTickets(res.data)
    } catch (err) {
      toast.error('Failed to load support tickets')
      console.error(err)
    } finally {
      if (!silent) setTicketsLoading(false)
    }
  }

  const fetchTicketDetails = async (id, silent = false) => {
    if (!silent) setMessagesLoading(true)
    try {
      const res = await axios.get(`/api/support/${id}`)
      setActiveTicket(res.data)
    } catch (err) {
      toast.error('Failed to load conversation details')
      console.error(err)
    } finally {
      if (!silent) setMessagesLoading(false)
    }
  }

  // Load tickets on mount
  useEffect(() => {
    if (user) {
      fetchTickets()
    }
  }, [user])

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeTicket?.messages])

  // Poll for new messages every 10 seconds if a ticket is open
  useEffect(() => {
    if (!activeTicket) return
    const interval = setInterval(() => {
      fetchTicketDetails(activeTicket.ticket.support_id, true)
    }, 10000)
    return () => clearInterval(interval)
  }, [activeTicket?.ticket?.support_id])

  const handleCreateTicketSubmit = async (e) => {
    e.preventDefault()
    if (!newSubject.trim()) {
      toast.error('Subject is required')
      return
    }

    setSubmittingTicket(true)
    try {
      const res = await axios.post('/api/support', {
        subject: newSubject,
        description: newDescription,
        priority: newPriority
      })
      toast.success('Support ticket created successfully!')
      setNewSubject('')
      setNewDescription('')
      setNewPriority('medium')
      setIsCreateOpen(false)
      fetchTickets()
      
      // Auto open the new ticket
      fetchTicketDetails(res.data.support_id)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create ticket')
      console.error(err)
    } finally {
      setSubmittingTicket(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    const cleanMsg = replyMessage ? replyMessage.replace(/<[^>]*>/g, '').trim() : '';
    if (!cleanMsg) return
    if (!activeTicket) return

    setSubmittingMessage(true)
    const ticketId = activeTicket.ticket.support_id
    try {
      await axios.post(`/api/support/${ticketId}/message`, {
        message: replyMessage
      })
      setReplyMessage('')
      await fetchTicketDetails(ticketId, true)
      fetchTickets(true)
    } catch (err) {
      toast.error('Failed to send message')
      console.error(err)
    } finally {
      setSubmittingMessage(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    if (!activeTicket) return
    setUpdatingStatus(true)
    const ticketId = activeTicket.ticket.support_id
    try {
      await axios.patch(`/api/support/${ticketId}`, {
        status: newStatus
      })
      toast.success(`Ticket marked as ${newStatus}`)
      await fetchTicketDetails(ticketId, true)
      fetchTickets(true)
    } catch (err) {
      toast.error('Failed to update ticket status')
      console.error(err)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-50 text-amber-700 border border-amber-200">Pending</span>
      case 'open':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-sky-50 text-sky-700 border border-sky-200">Open</span>
      case 'in_progress':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-blue-50 text-blue-700 border border-blue-200">In Progress</span>
      case 'resolved':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-[#73976A]/10 text-[#73976A] border border-[#73976A]/20">Resolved</span>
      case 'closed':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-700 border border-slate-200">Closed</span>
      default:
        return <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-700">{status}</span>
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'low':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 uppercase border border-slate-200">Low</span>
      case 'medium':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-50 text-blue-700 uppercase border border-blue-200">Medium</span>
      case 'high':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-700 uppercase border border-amber-200">High</span>
      case 'urgent':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#BD4444]/10 text-[#BD4444] uppercase border border-[#BD4444]/20 animate-pulse">Urgent</span>
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 uppercase border border-slate-200">{priority}</span>
    }
  }

  if (userLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#F1F5F9]">
        <BiLoaderAlt className="animate-spin text-4xl text-[#73976A]" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#F1F5F9]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xs border border-slate-200 p-6 md:p-8 flex flex-col gap-4 text-center">
          <BiSupport className="text-5xl text-slate-400 mx-auto" />
          <h1 className="text-xl font-bold text-slate-800">Support Center</h1>
          <p className="text-slate-600 text-xs leading-relaxed">
            Please log in to your account to view support tickets and connect with customer service representatives.
          </p>
          <div className="mt-2">
            <Link href="/login" className="px-6 py-2.5 bg-[#73976A] text-white rounded-xl text-xs font-bold hover:bg-[#607E59] transition cursor-pointer shadow-xs">
              Log In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full min-h-screen bg-[#F1F5F9] pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${userSidebar ? 'lg:pl-60' : 'lg:pl-8'}`}>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <BiSupport className="text-[#73976A] text-2xl" />
              Customer Support Center
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Submit support inquiries and chat with our staff in real-time.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/user" className="px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-xl text-xs font-bold hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 shadow-2xs">
              <BiArrowBack /> Profile
            </Link>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 bg-[#73976A] hover:bg-[#607E59] text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <BiPlus className="text-base" /> Create New Ticket
            </button>
          </div>
        </div>

        {/* Main Work Area */}
        <div className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Left panel: Ticket List */}
          <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col shrink-0 ${activeTicket ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
              <h2 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Your Tickets</h2>
              <button 
                onClick={() => fetchTickets()} 
                disabled={ticketsLoading}
                className="p-1 hover:bg-slate-200/60 rounded text-slate-500 transition cursor-pointer disabled:opacity-50"
              >
                <BiRefresh className={`text-base ${ticketsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="p-3 flex flex-col gap-2">
              {ticketsLoading && tickets.length === 0 ? (
                <div className="py-12 flex items-center justify-center text-slate-400 gap-1.5 text-xs">
                  <BiLoaderAlt className="animate-spin text-base" /> Loading tickets...
                </div>
              ) : tickets.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center p-6 text-center text-slate-400 gap-2">
                  <BiMessageSquareDetail className="text-3xl text-slate-350" />
                  <p className="text-xs font-bold text-slate-700">No support tickets yet</p>
                  <p className="text-[11px] text-slate-400">Click the button above to start your first support query.</p>
                </div>
              ) : (
                tickets.map((ticket) => {
                  const isActive = activeTicket?.ticket?.support_id === ticket.support_id
                  return (
                    <div
                      key={ticket.support_id}
                      onClick={() => fetchTicketDetails(ticket.support_id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition select-none flex flex-col gap-1.5 ${
                        isActive 
                          ? 'bg-[#73976A] border-[#607E59] text-white shadow-xs' 
                          : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold truncate flex-1">{ticket.subject}</span>
                        <span className={`text-[11px] font-mono shrink-0 ${isActive ? 'text-white/80' : 'text-slate-400'}`}>#{ticket.support_id}</span>
                      </div>
                      
                      {ticket.description && (
                        <p className={`text-[11px] line-clamp-1 ${isActive ? 'text-white/90' : 'text-slate-500'}`}>
                          {ticket.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center mt-1 flex-wrap gap-1.5">
                        <div className="flex items-center gap-1.5">
                          {getPriorityBadge(ticket.priority)}
                        </div>
                        <span className={`text-[10px] font-bold uppercase ${isActive ? 'text-white' : 'text-slate-600'}`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right panel: Active Chat view */}
          <div className={`flex-1 flex flex-col bg-slate-50/40 ${!activeTicket ? 'hidden md:flex items-center justify-center text-slate-400 p-8' : 'flex'}`}>
            {activeTicket ? (
              <div className="flex-1 flex flex-col">
                {/* Active Chat Header */}
                <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button 
                        onClick={() => setActiveTicket(null)}
                        className="md:hidden p-1 hover:bg-slate-100 rounded text-slate-600 mr-1"
                      >
                        <BiChevronRight className="rotate-180 text-xl" />
                      </button>
                      <h3 className="font-bold text-slate-800 text-sm truncate">{activeTicket.ticket.subject}</h3>
                      <span className="text-[11px] font-mono text-slate-400">ID: #{activeTicket.ticket.support_id}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {getPriorityBadge(activeTicket.ticket.priority)}
                      {getStatusBadge(activeTicket.ticket.status)}
                    </div>
                  </div>

                  {/* Status update widget */}
                  <div className="flex items-center gap-2 shrink-0">
                    {activeTicket.ticket.status !== 'closed' && activeTicket.ticket.status !== 'resolved' ? (
                      <button
                        onClick={() => handleStatusChange('resolved')}
                        disabled={updatingStatus}
                        className="px-3 py-1.5 bg-[#73976A]/10 hover:bg-[#73976A]/20 text-[#73976A] text-xs font-bold rounded-lg border border-[#73976A]/30 transition cursor-pointer disabled:opacity-50 shadow-2xs"
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange('open')}
                        disabled={updatingStatus}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition cursor-pointer disabled:opacity-50 shadow-2xs"
                      >
                        Reopen Ticket
                      </button>
                    )}
                  </div>
                </div>

                {/* Chat Message Window */}
                <div className="p-4 flex flex-col gap-3.5 bg-slate-50/50">
                  
                  {/* Initial Ticket Description block */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs max-w-2xl mx-auto w-full flex flex-col gap-2">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-[#73976A] text-white font-bold text-xs flex items-center justify-center">
                          {activeTicket.ticket.user_name?.substring(0,2).toUpperCase() || 'US'}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800">{activeTicket.ticket.user_name}</span>
                          <span className="text-[10px] text-slate-400 block -mt-0.5">Author</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(activeTicket.ticket.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div 
                      className="text-xs text-slate-700 leading-relaxed ProseMirror"
                      dangerouslySetInnerHTML={{ __html: activeTicket.ticket.description || '<span class="italic text-slate-400">No initial description provided.</span>' }}
                    />
                  </div>

                  <div className="w-full flex items-center justify-center my-2 shrink-0">
                    <div className="h-px bg-slate-200 w-1/4"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5">Thread Responses</span>
                    <div className="h-px bg-slate-200 w-1/4"></div>
                  </div>

                  {messagesLoading ? (
                    <div className="py-8 flex items-center justify-center text-slate-400 text-xs gap-1.5">
                      <BiLoaderAlt className="animate-spin" /> Loading messages...
                    </div>
                  ) : activeTicket.messages?.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center p-6 text-center text-slate-400 gap-1.5">
                      <BiInfoCircle className="text-2xl text-slate-350" />
                      <p className="text-xs font-bold text-slate-700">No response messages yet</p>
                      <p className="text-[11px] text-slate-400">Our customer support division has been notified. You can post updates below.</p>
                    </div>
                  ) : (
                    activeTicket.messages.map((msg) => {
                      const isMe = msg.sender_id === user.user_id
                      const isSupport = ['admin', 'manager', 'sales'].includes(msg.sender_role)

                      return (
                        <div 
                          key={msg.message_id} 
                          className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                        >
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5 px-1 font-semibold">
                            <span>{msg.sender_name}</span>
                            {isSupport && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#73976A] text-white uppercase">Staff</span>
                            )}
                          </div>

                          <div 
                            className={`p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ProseMirror ${
                              isMe 
                                ? 'bg-[#73976A] text-white rounded-tr-none' 
                                : isSupport
                                  ? 'bg-slate-100 text-slate-900 border border-slate-200 rounded-tl-none font-medium'
                                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                            }`}
                            dangerouslySetInnerHTML={{ __html: msg.message }}
                          />

                          <span className="text-[11px] text-slate-400 font-mono mt-1 px-1">
                            {new Date(msg.created_at).toLocaleTimeString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Message Input Bar */}
                <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                  <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <RichTextEditor value={replyMessage} onChange={setReplyMessage} />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingMessage || !(replyMessage && replyMessage.replace(/<[^>]*>/g, '').trim())}
                      className="px-4 py-2.5 bg-[#73976A] hover:bg-[#607E59] text-white rounded-xl text-sm font-bold transition cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-40 shadow-xs"
                    >
                      {submittingMessage ? (
                        <BiLoaderAlt className="animate-spin text-lg" />
                      ) : (
                        <BiSend className="text-lg" />
                      )}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 select-none text-center p-6 py-16">
                <BiSupport className="text-5xl text-slate-300" />
                <h3 className="font-bold text-slate-700 text-sm">Select a ticket to begin chatting</h3>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Choose a ticket from the left panel or click 'Create New Ticket' to initiate a support thread.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* CREATE TICKET MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BiSupport className="text-xl text-[#73976A]" />
                <h3 className="font-bold text-slate-800 text-sm">Initiate Support Query</h3>
              </div>
              <button 
                onClick={() => setIsCreateOpen(false)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 transition cursor-pointer"
              >
                <BiX className="text-xl" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateTicketSubmit} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Subject <span className="text-[#BD4444]">*</span></label>
                <input className="input-style focus:border-[#73976A]"
                  required
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Priority</label>
                <div className="grid grid-cols-4 gap-2">
                  {['low', 'medium', 'high', 'urgent'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase border transition cursor-pointer ${
                        newPriority === p
                          ? p === 'urgent'
                            ? 'bg-[#BD4444]/10 border-[#BD4444] text-[#BD4444] shadow-2xs'
                            : p === 'high'
                              ? 'bg-amber-50 border-amber-400 text-amber-700 shadow-2xs'
                              : p === 'medium'
                                ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-2xs'
                                : 'bg-[#73976A]/10 border-[#73976A] text-[#73976A] shadow-2xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Detailed Description</label>
                <RichTextEditor value={newDescription} onChange={setNewDescription} />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTicket}
                  className="px-4 py-2 bg-[#73976A] hover:bg-[#607E59] text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  {submittingTicket ? (
                    <>
                      <BiLoaderAlt className="animate-spin text-sm" />
                      Creating...
                    </>
                  ) : (
                    'Submit Ticket'
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}

