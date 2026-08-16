import Dashboardnavbar from '@/component/bars/Dashboardnavbar'
import Dashboardsidebar from '@/component/bars/Dashboardsidebar'
import { isManagementRole } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'
import { STORE_NAME, STORE_TAGLINE } from '@/lib/secret'

export const metadata = {
  title: `Dashboard | ${STORE_NAME} - ${STORE_TAGLINE}`,
  description: `Management Dashboard on ${STORE_NAME}, ${STORE_TAGLINE}.`,
}

export default async function DashboardLayout({ children }) {
  const auth=await isManagementRole()
  if(!auth.success) redirect('/user')
  return (
    <div className='w-full overflow-x-hidden relative'>
      <Dashboardnavbar/>
      <Dashboardsidebar/>
      {children}
    </div>
  )
}
