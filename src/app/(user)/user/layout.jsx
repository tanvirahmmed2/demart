import Usernavbar from '@/component/bars/Usernavbar'
import Usersidebar from '@/component/bars/Usersidebar'
import { isUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'
import { STORE_NAME, STORE_TAGLINE } from '@/lib/secret'

export const metadata = {
  title: `User Portal | ${STORE_NAME} - ${STORE_TAGLINE}`,
  description: `User account dashboard on ${STORE_NAME}, ${STORE_TAGLINE}.`,
}

export default async function UserLayout({ children }) {
  const auth=await isUser()
  if(!auth.success) redirect('/login')
  return (
    <div className='w-full relative overflow-x-hidden pt-14'>
      <Usernavbar/>
      <Usersidebar/>
      {children}
    </div>
  )
}
