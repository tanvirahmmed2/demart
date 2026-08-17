'use client'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Context } from '@/component/helper/Context'
import { STORE_NAME, STORE_TAGLINE } from '@/lib/secret'
import { 
  BiCog, 
  BiUpload, 
  BiLoaderAlt, 
  BiSave, 
  BiShow,
  BiGlobe,
  BiPalette,
  BiLayout,
  BiLink
} from 'react-icons/bi'

export default function DashboardAdminSettingsPage() {
  const { dashSidebar, fetchWebsite } = useContext(Context)
  
  // Form fields
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [sociallink, setSociallink] = useState('')
  const [themeColor, setThemeColor] = useState('#73976A')
  const [heroTitle, setHeroTitle] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  
  // Logo upload state
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [existingLogoUrl, setExistingLogoUrl] = useState('')

  // UI status
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings')
        const data = res.data
        if (data) {
          setEmail(data.email || '')
          setPhone(data.phone || '')
          setAddress(data.address || '')
          setSociallink(data.sociallink || '')
          setThemeColor(data.theme_color || '#73976A')
          setHeroTitle(data.hero_title || '')
          setHeroSubtitle(data.hero_subtitle || '')
          setLogoPreview(data.logo_url || '')
          setExistingLogoUrl(data.logo_url || '')
        }
      } catch (err) {
        toast.error('Failed to load website settings')
        console.error(err)
      } finally {
        setFetching(false)
      }
    }
    fetchSettings()
  }, [])

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    const formData = new FormData()
    formData.append('email', email)
    formData.append('phone', phone)
    formData.append('address', address)
    formData.append('sociallink', sociallink)
    formData.append('theme_color', themeColor)
    formData.append('hero_title', heroTitle)
    formData.append('hero_subtitle', heroSubtitle)
    formData.append('logo_url', existingLogoUrl)
    
    if (logoFile) {
      formData.append('logo', logoFile)
    }

    try {
      const res = await axios.post('/api/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Website settings updated successfully!')
      if (res.data && res.data.logo_url) {
        setExistingLogoUrl(res.data.logo_url)
        setLogoPreview(res.data.logo_url)
        setLogoFile(null)
      }
      if (fetchWebsite) {
        fetchWebsite()
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save settings')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (fetching) {
    return (
      <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-64' : 'lg:pl-8'} flex items-center justify-center`}>
        <div className="flex items-center gap-2 text-slate-500 font-semibold">
          <BiLoaderAlt className="animate-spin text-xl text-slate-800" />
          <span>Loading settings details...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-2 sm:px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-64' : 'lg:pl-8'}`}>
      <div className="w-full flex flex-col gap-6">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BiCog style={{ color: themeColor }} />
            Website Settings & Configuration
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-0.5">Configure store branding, theme palettes, contact details, and landing page banner headers.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Settings Form Panel */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* General Identity */}
            <div className="bg-white border border-slate-200 shadow-sm p-5 md:p-6 flex flex-col gap-5">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <BiGlobe style={{ color: themeColor }} className="text-base" /> General Identity
              </h2>
              
              {/* Secret.js Info Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: themeColor }}>Secret Configured</span>
                  <h4 className="text-xs font-bold text-slate-800">{STORE_NAME}</h4>
                  <p className="text-[11px] text-slate-500 italic mt-0.5">"{STORE_TAGLINE}"</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5">
                  Managed in secret.js
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Store Support Email</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-3 py-2 border border-slate-200 text-xs text-slate-800 outline-none"
                  />
                </div>

                {/* Contact Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Store Customer Phone</label>
                  <input 
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="px-3 py-2 border border-slate-200 text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Office Showroom / Warehouse Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="px-3 py-2 border border-slate-200 text-xs text-slate-800 outline-none resize-none"
                />
              </div>

              {/* Social Link */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <BiLink className="text-slate-400 text-sm" /> Social Profile Link (e.g. Facebook/Instagram)
                </label>
                <input 
                  type="text"
                  value={sociallink}
                  onChange={(e) => setSociallink(e.target.value)}
                  className="px-3 py-2 border border-slate-200 text-xs text-slate-800 outline-none"
                />
              </div>

            </div>

            {/* Layout Settings & Hero Banner */}
            <div className="bg-white border border-slate-200 shadow-sm p-5 md:p-6 flex flex-col gap-5">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <BiLayout style={{ color: themeColor }} className="text-base" /> Landing Hero Section
              </h2>

              {/* Hero Banner Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Hero Main Title Banner</label>
                <input 
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="px-3 py-2 border border-slate-200 text-xs text-slate-800 outline-none"
                />
              </div>

              {/* Hero Banner Subtitle */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Hero Subtitle Banner</label>
                <textarea
                  rows={2}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="px-3 py-2 border border-slate-200 text-xs text-slate-800 outline-none resize-none"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Visual Elements & Realtime Preview */}
          <div className="flex flex-col gap-6">
            
            {/* Visual Branding Appearance */}
            <div className="bg-white border border-slate-200 shadow-sm p-5 md:p-6 flex flex-col gap-5">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <BiPalette style={{ color: themeColor }} className="text-base" /> Visual Branding
              </h2>

              {/* Theme Color Picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Primary Theme Color</label>
                <div className="flex gap-3 items-center bg-slate-50 p-2.5 border border-slate-200">
                  <input className="w-8 h-8 border border-slate-300 cursor-pointer"
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-800 uppercase">{themeColor}</span>
                    <span className="text-[10px] text-slate-500 block">Applied as store primary brand accents</span>
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-slate-700">Website Logo File</label>
                
                <div className="flex flex-col items-center gap-4 border-2 border-dashed border-slate-200 p-4 hover:bg-slate-50 transition relative">
                  
                  {logoPreview ? (
                    <div className="relative w-24 h-24 border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="object-contain w-full h-full p-1"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 text-[10px] font-bold uppercase tracking-wider border-dashed border-2">
                      No Logo
                    </div>
                  )}

                  <label className="w-full flex items-center justify-center py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer select-none gap-1.5 border border-slate-200">
                    <BiUpload className="text-base" style={{ color: themeColor }} /> Click to upload
                    <input className="hidden"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
              </div>

              {/* Save Controls */}
              <div className="border-t border-slate-100 pt-4 mt-1 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 text-white text-xs md:text-sm font-bold transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  style={{ backgroundColor: themeColor }}
                >
                  {saving ? (
                    <>
                      <BiLoaderAlt className="animate-spin text-lg" />
                      Saving settings...
                    </>
                  ) : (
                    <>
                      <BiSave className="text-lg" /> Save Changes
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Banner Live Rendering Card */}
            <div className="bg-white border border-slate-200 shadow-sm p-5 md:p-6 flex flex-col gap-4">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <BiShow style={{ color: themeColor }} className="text-base" /> Live Hero Preview
              </h2>

              {/* Simulated Hero Card */}
              <div className="w-full p-5 border border-slate-200 relative min-h-[160px] flex flex-col justify-center gap-2"
                   style={{
                     background: `linear-gradient(135deg, ${themeColor}1a, ${themeColor}05)`,
                     borderLeft: `5px solid ${themeColor}`
                   }}
              >
                {/* Logo mock */}
                {logoPreview && (
                  <div className="w-10 h-10 bg-white/80 p-1 w-fit mb-1 border border-slate-200">
                    <img src={logoPreview} alt="mock" className="object-contain w-full h-full" />
                  </div>
                )}
                
                <h3 className="text-xs md:text-sm font-bold text-slate-800 leading-tight">
                  {heroTitle || 'Your Banner Title Banner'}
                </h3>
                
                <p className="text-[10px] text-slate-600 leading-relaxed">
                  {heroSubtitle || 'Your Hero subtitle details banner content here.'}
                </p>
                
                <button
                  type="button"
                  className="w-fit px-3 py-1 mt-1 text-white text-[10px] font-bold transition shadow-sm"
                  style={{ backgroundColor: themeColor }}
                >
                  Shop Now
                </button>
              </div>
            </div>

          </div>

        </form>

      </div>
    </div>
  )
}


