import React from 'react'
import { STORE_NAME, STORE_TAGLINE } from '@/lib/secret'

export const metadata = {
  title: `Privacy Policy | ${STORE_NAME} - ${STORE_TAGLINE}`,
  description: `Explore Privacy Policy page on ${STORE_NAME}, ${STORE_TAGLINE}.`,
}

export default function PrivacyPolicyLayout({ children }) {
  return (
    <>
      {children}
    </>
  )
}
