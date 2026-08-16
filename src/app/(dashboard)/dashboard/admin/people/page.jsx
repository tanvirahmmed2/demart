'use client'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Context } from '@/component/helper/Context'
import { 
  BiSearch, 
  BiUser, 
  BiShield, 
  BiBlock, 
  BiCheckCircle,
  BiLoaderAlt
} from 'react-icons/bi'

export default function DashboardAdminPeoplePage() {
  const { dashSidebar, user: currentUser } = useContext(Context)
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/people')
      setUsers(res.data)
    } catch (err) {
      toast.error('Failed to load accounts database')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId)
    try {
      await axios.put(`/api/people/${userId}`, { role: newRole })
      toast.success(`Role updated to ${newRole} successfully`)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update role')
      console.error(err)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleBanToggle = async (userId, currentBanStatus) => {
    const action = currentBanStatus ? 'unban' : 'ban'
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return
    }
    
    setUpdatingId(userId)
    try {
      await axios.put(`/api/people/${userId}`, { is_banned: !currentBanStatus })
      toast.success(`User account has been ${currentBanStatus ? 'unbanned' : 'banned'}`)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.error || `Failed to ${action} user`)
      console.error(err)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleActiveToggle = async (userId, currentActiveStatus) => {
    setUpdatingId(userId)
    try {
      await axios.put(`/api/people/${userId}`, { is_active: !currentActiveStatus })
      toast.success(`User account has been ${currentActiveStatus ? 'deactivated' : 'activated'}`)
      fetchUsers()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update account status')
      console.error(err)
    } finally {
      setUpdatingId(null)
    }
  }

  // Filter users based on search
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.phone && u.phone.includes(search)) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  // Compute stats
  const stats = {
    total: users.length,
    active: users.filter((u) => u.is_active && !u.is_banned).length,
    banned: users.filter((u) => u.is_banned).length,
  }

  return (
    <div className={`w-full min-h-screen bg-[#F1F5F9] pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-64' : 'lg:pl-8'}`}>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BiUser className="text-[#73976A]" />
            Accounts Management
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-0.5">Promote roles, activate accounts, and manage bans for store users.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {/* Total Accounts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total registered</span>
              <span className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.total}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#73976A]/10 text-[#73976A] border border-[#73976A]/20 flex items-center justify-center text-xl shrink-0">
              <BiUser />
            </div>
          </div>

          {/* Active Accounts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active & Valid</span>
              <span className="text-2xl font-bold text-[#73976A]">{loading ? '...' : stats.active}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#73976A]/10 text-[#73976A] border border-[#73976A]/20 flex items-center justify-center text-xl shrink-0">
              <BiCheckCircle />
            </div>
          </div>

          {/* Banned Accounts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Suspended / Banned</span>
              <span className="text-2xl font-bold text-[#BD4444]">{loading ? '...' : stats.banned}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#BD4444]/10 text-[#BD4444] border border-[#BD4444]/20 flex items-center justify-center text-xl shrink-0">
              <BiBlock />
            </div>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex-1 max-w-md relative">
            <BiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input className="input-style border border-slate-200 focus:border-[#73976A]"
              type="text"
              placeholder="Search by name, email, phone or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table content */}
        {loading ? (
          <div className="w-full h-64 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center text-slate-500 gap-2">
            <BiLoaderAlt className="animate-spin text-xl text-[#73976A]" />
            <span>Loading registered database...</span>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-[#F1F5F9] text-slate-700 font-bold border-b border-slate-200">
                    <th className="px-3 md:px-6 py-3.5">User Details</th>
                    <th className="px-3 md:px-6 py-3.5">Current Role</th>
                    <th className="px-3 md:px-6 py-3.5 hidden sm:table-cell">Verification</th>
                    <th className="px-3 md:px-6 py-3.5 hidden md:table-cell">Banned</th>
                    <th className="px-3 md:px-6 py-3.5 hidden md:table-cell">Active</th>
                    <th className="px-3 md:px-6 py-3.5 text-right hidden lg:table-cell">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredUsers.map((u) => {
                    const isSelf = currentUser && u.user_id === currentUser.user_id
                    return (
                      <tr key={u.user_id} className={`hover:bg-slate-50 transition ${isSelf ? 'bg-amber-50/40' : ''}`}>
                        
                        {/* Name & Contact */}
                        <td className="px-3 md:px-6 py-3.5">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-xs md:text-base flex items-center gap-1.5">
                              {u.name}
                              {isSelf && (
                                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] md:text-xs font-semibold bg-amber-100 text-amber-800">
                                  You
                                </span>
                              )}
                            </span>
                            <span className="text-slate-500 text-[11px] md:text-xs mt-0.5">{u.email}</span>
                            {u.phone && <span className="text-slate-400 text-[11px] md:text-xs mt-0.5">{u.phone}</span>}
                            {/* Mobile inline badges when hidden */}
                            <div className="flex sm:hidden items-center gap-1.5 mt-1.5">
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                                u.is_varified ? 'bg-[#73976A]/10 text-[#73976A]' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {u.is_varified ? 'Verified' : 'Pending'}
                              </span>
                              {u.is_banned && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-[#BD4444]/10 text-[#BD4444]">
                                  Banned
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Dropdown Role Promotion */}
                        <td className="px-3 md:px-6 py-3.5">
                          {isSelf ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-bold bg-slate-900 text-white shadow-xs capitalize">
                              <BiShield className="mr-1 text-xs md:text-sm text-yellow-400" />
                              {u.role}
                            </span>
                          ) : (
                            <select
                              value={u.role}
                              disabled={updatingId === u.user_id}
                              onChange={(e) => handleRoleChange(u.user_id, e.target.value)}
                              className="px-2 md:px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-[11px] md:text-xs font-bold focus:bg-white focus:ring-2 focus:ring-[#73976A]/20 focus:border-[#73976A] outline-none transition disabled:opacity-50"
                            >
                              <option value="admin">Admin</option>
                              <option value="manager">Manager</option>
                              <option value="sales">Sales</option>
                              <option value="user">User</option>
                            </select>
                          )}
                        </td>

                        {/* Verified Badges */}
                        <td className="px-3 md:px-6 py-3.5 hidden sm:table-cell">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                            u.is_varified ? 'bg-[#73976A]/10 text-[#73976A] border border-[#73976A]/20' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {u.is_varified ? 'Verified' : 'Pending'}
                          </span>
                        </td>

                        {/* Banned Toggles */}
                        <td className="px-3 md:px-6 py-3.5 hidden md:table-cell">
                          <button
                            type="button"
                            disabled={isSelf || updatingId === u.user_id}
                            onClick={() => handleBanToggle(u.user_id, u.is_banned)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                              u.is_banned ? 'bg-[#BD4444]' : 'bg-slate-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                u.is_banned ? 'translate-x-4.5' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        </td>

                        {/* Active States toggles */}
                        <td className="px-3 md:px-6 py-3.5 hidden md:table-cell">
                          <button
                            type="button"
                            disabled={isSelf || updatingId === u.user_id}
                            onClick={() => handleActiveToggle(u.user_id, u.is_active)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                              u.is_active ? 'bg-[#73976A]' : 'bg-slate-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                u.is_active ? 'translate-x-4.5' : 'translate-x-0.5'
                              }`}
                            />
                          </button>
                        </td>

                        {/* Extra stats/timestamps */}
                        <td className="px-3 md:px-6 py-3.5 text-right hidden lg:table-cell">
                          <span className="text-xs text-slate-400 font-mono">
                            Since {new Date(u.created_at).toLocaleDateString()}
                          </span>
                        </td>

                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="w-full py-16 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-slate-400 gap-2">
            <BiUser className="text-4xl text-slate-300" />
            <p className="font-bold text-slate-600">No accounts match search filters</p>
            <p className="text-xs text-slate-400">Try a different search term or check spelling.</p>
          </div>
        )}

      </div>
    </div>
  )
}

