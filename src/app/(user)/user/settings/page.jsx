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
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white border border-slate-200 p-6 md:p-8 flex flex-col gap-4 text-center shadow-sm">
          <BiUser className="text-5xl text-slate-400 mx-auto" />
          <h1 className="text-xl font-bold text-slate-800">Settings Access</h1>
          <p className="text-slate-600 text-xs leading-relaxed">Please log in to your user profile to access account settings.</p>
          <div className="mt-2">
            <Link href="/login" className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer shadow-sm">
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
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-2 sm:px-4 md:px-8 transition-all duration-300 ${userSidebar ? 'lg:pl-60' : 'lg:pl-8'}`}>
      <div className="w-full flex flex-col gap-6">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <BiCog className="text-2xl text-primary" />
              Account Settings
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage your personal profile details, change security credentials, or manage account state.</p>
          </div>
          <Link href="/user" className="px-4 py-2 border border-slate-200 text-slate-700 bg-white text-xs font-bold hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 shadow-sm">
            <BiArrowBack /> Back to Profile
          </Link>
        </div>

        {/* Section 1: Profile Information */}
        <div className="bg-white border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12">
          
          {/* Left panel (Avatar block) */}
          <div className="md:col-span-4 bg-slate-50 p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200 gap-3">
            <div className="w-20 h-20 bg-primary text-white font-bold text-2xl flex items-center justify-center shadow-sm select-none">
              {initials}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm leading-normal">{name || user.name}</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mt-1 inline-block border border-slate-300 bg-white text-slate-700">
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
              <label className="text-xs font-bold text-slate-700 uppercase">Full Name <span className="text-rose-600">*</span></label>
              <div className="relative">
                <BiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input 
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 px-3 py-2 pl-9 outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Email Address <span className="text-rose-600">*</span></label>
              <div className="relative">
                <BiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 px-3 py-2 pl-9 outline-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Phone Number</label>
              <div className="relative">
                <BiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 px-3 py-2 pl-9 outline-none"
                />
              </div>
            </div>

            {/* Submit profile btn */}
            <div className="flex justify-end pt-4 border-t border-slate-100 mt-2">
              <button
                type="submit"
                disabled={submittingProfile}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
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
        <div className="bg-white border border-slate-200 shadow-sm p-5 md:p-6 flex flex-col gap-4">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <BiLockAlt className="text-primary text-base" /> Change Password
          </h2>

          <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Current Password</label>
              <div className="relative">
                <BiLockAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input 
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 px-3 py-2 pl-9 outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">New Password</label>
              <div className="relative">
                <BiLockAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 px-3 py-2 pl-9 outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Confirm New Password</label>
              <div className="relative">
                <BiLockAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 px-3 py-2 pl-9 outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-3 flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={submittingPassword || !newPassword}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-40"
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
        <div className="bg-white border border-rose-200 shadow-sm p-5 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
              <BiErrorCircle className="text-rose-600 text-base" /> Danger Zone - Account Deletion
            </h2>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-xl">
              Permanently remove your user account profile. Once deleted, your login credentials will be removed and you will be logged out immediately.
            </p>
          </div>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <BiTrash className="text-sm" /> Delete My Account
          </button>
        </div>

      </div>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md border border-slate-200 shadow-xl flex flex-col p-6 gap-4 text-center">
            <div className="w-12 h-12 bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 text-2xl mx-auto font-bold">
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
                className="px-5 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
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
