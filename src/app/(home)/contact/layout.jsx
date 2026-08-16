import React from 'react'
import { STORE_NAME, STORE_TAGLINE } from '@/lib/secret'

export const metadata = {
  title: `Contact | ${STORE_NAME} - ${STORE_TAGLINE}`,
  description: `Explore Contact page on ${STORE_NAME}, ${STORE_TAGLINE}.`,
}

export default function ContactLayout({ children }) {
  return (
    <>
      {children}
    </>
  )
}
