'use client'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Context } from '@/component/helper/Context'
import { 
  BiUser, 
  BiEnvelope, 
  BiPhone, 
  BiLoaderAlt, 
  BiArrowBack,
  BiSave,
  BiCog,
  BiLockAlt,
  BiTrash,
  BiErrorCircle
} from 'react-icons/bi'

export default function UserSettingsPage() {
  const { user, setUser, loading: userLoading, userSidebar } = useContext(Context)

  // Profile states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submittingProfile, setSubmittingProfile] = useState(false)

  // Password states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submittingPassword, setSubmittingPassword] = useState(false)

  // Delete account modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setPhone(user.phone || '')
    }
  }, [user])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Name is required')
      return
    }
    if (!email.trim()) {
      toast.error('Email is required')
      return
    }

    setSubmittingProfile(true)
    try {
      const res = await axios.put('/api/user', {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim()
      })
      toast.success(res.data.message || 'Profile updated successfully!')
      setUser(res.data.user)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile settings')
      console.error(err)
    } finally {
      setSubmittingProfile(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!currentPassword) {
      toast.error('Please enter your current password')
      return
    }
    if (!newPassword) {
      toast.error('Please enter a new password')
      return
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    setSubmittingPassword(true)
    try {
      const res = await axios.put('/api/user', {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        currentPassword,
        newPassword
      })
      toast.success(res.data.message || 'Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      if (res.data.user) setUser(res.data.user)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password')
      console.error(err)
    } finally {
      setSubmittingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeletingAccount(true)
    try {
      await axios.delete('/api/user')
      toast.success('Your account has been deleted.')
      setUser(null)
      window.location.replace('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete account')
      console.error(err)
    } finally {
      setDeletingAccount(false)
      setIsDeleteModalOpen(false)
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
          <BiUser className="text-5xl text-slate-400 mx-auto" />
          <h1 className="text-xl font-bold text-slate-800">Settings Access</h1>
          <p className="text-slate-600 text-xs leading-relaxed">Please log in to your user profile to access account settings.</p>
          <div className="mt-2">
            <Link href="/login" className="px-6 py-2.5 bg-[#73976A] text-white rounded-xl text-xs font-bold hover:bg-[#607E59] transition cursor-pointer shadow-xs">
              Log In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const initials = name
    ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'US'

  return (
    <div className={`w-full min-h-screen bg-[#F1F5F9] pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${userSidebar ? 'lg:pl-60' : 'lg:pl-8'}`}>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <BiCog className="text-[#73976A] text-2xl" />
              Account Settings
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage your personal profile details, change security credentials, or manage account state.</p>
          </div>
          <Link href="/user" className="px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-xl text-xs font-bold hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 shadow-2xs">
            <BiArrowBack /> Back to Profile
          </Link>
        </div>

        {/* Section 1: Profile Information */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left panel (Avatar block) */}
          <div className="md:col-span-4 bg-slate-50 p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200 gap-3">
            <div className="w-20 h-20 rounded-2xl bg-[#73976A] text-white font-bold text-2xl flex items-center justify-center shadow-xs border border-[#607E59] select-none">
              {initials}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm leading-normal">{name || user.name}</h3>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#73976A]/10 text-[#73976A] uppercase tracking-wider mt-1 inline-block border border-[#73976A]/20">
                {user.role} Account
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 max-w-[180px] leading-relaxed">
              Updates to your name, email or phone number will synchronize across your customer record.
            </p>
          </div>

          {/* Right panel (Profile Form) */}
          <form onSubmit={handleUpdateProfile} className="md:col-span-8 p-5 md:p-6 flex flex-col gap-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Personal Details</h2>
            
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Full Name <span className="text-[#BD4444]">*</span></label>
              <div className="relative">
                <BiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input className="input-style pl-9 focus:border-[#73976A]"
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Email Address <span className="text-[#BD4444]">*</span></label>
              <div className="relative">
                <BiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input className="input-style pl-9 focus:border-[#73976A]"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Phone Number</label>
              <div className="relative">
                <BiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input className="input-style pl-9 focus:border-[#73976A]"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Submit profile btn */}
            <div className="flex justify-end pt-4 border-t border-slate-100 mt-2">
              <button
                type="submit"
                disabled={submittingProfile}
                className="px-5 py-2.5 bg-[#73976A] hover:bg-[#607E59] text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {submittingProfile ? (
                  <>
                    <BiLoaderAlt className="animate-spin text-sm" /> Saving Profile...
                  </>
                ) : (
                  <>
                    <BiSave className="text-sm" /> Update Profile
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

        {/* Section 2: Password Security */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6 flex flex-col gap-4">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <BiLockAlt className="text-[#73976A] text-base" /> Change Password
          </h2>

          <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Current Password</label>
              <div className="relative">
                <BiLockAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input className="input-style pl-9 focus:border-[#73976A]"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">New Password</label>
              <div className="relative">
                <BiLockAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input className="input-style pl-9 focus:border-[#73976A]"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Confirm New Password</label>
              <div className="relative">
                <BiLockAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input className="input-style pl-9 focus:border-[#73976A]"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="md:col-span-3 flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={submittingPassword || !newPassword}
                className="px-5 py-2.5 bg-[#73976A] hover:bg-[#607E59] text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-40"
              >
                {submittingPassword ? (
                  <>
                    <BiLoaderAlt className="animate-spin text-sm" /> Changing Password...
                  </>
                ) : (
                  <>
                    <BiLockAlt className="text-sm" /> Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Section 3: Danger Zone - Delete Account */}
        <div className="bg-white rounded-2xl border border-[#BD4444]/30 shadow-xs p-5 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xs font-bold text-[#BD4444] uppercase tracking-wider flex items-center gap-1.5">
              <BiErrorCircle className="text-[#BD4444] text-base" /> Danger Zone - Account Deletion
            </h2>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-xl">
              Permanently remove your user account profile. Once deleted, your login credentials will be removed and you will be logged out immediately.
            </p>
          </div>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2.5 bg-[#BD4444]/10 hover:bg-[#BD4444]/20 text-[#BD4444] border border-[#BD4444]/30 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs"
          >
            <BiTrash className="text-sm" /> Delete My Account
          </button>
        </div>

      </div>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col p-6 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#BD4444]/10 border border-[#BD4444]/20 flex items-center justify-center text-[#BD4444] text-3xl mx-auto">
              <BiErrorCircle />
            </div>

            <div>
              <h3 className="font-bold text-slate-800 text-base">Delete Your Account?</h3>
              <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                This action is permanent and cannot be undone. Are you sure you want to delete your account profile?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="px-5 py-2.5 bg-[#BD4444] hover:bg-[#842f2f] text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
              >
                {deletingAccount ? (
                  <>
                    <BiLoaderAlt className="animate-spin text-sm" /> Deleting...
                  </>
                ) : (
                  <>
                    <BiTrash className="text-sm" /> Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}