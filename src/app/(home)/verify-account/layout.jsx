import React from 'react'
import { STORE_NAME, STORE_TAGLINE } from '@/lib/secret'

export const metadata = {
  title: `Verify Account | ${STORE_NAME} - ${STORE_TAGLINE}`,
  description: `Explore Verify Account page on ${STORE_NAME}, ${STORE_TAGLINE}.`,
}

export default function VerifyAccountLayout({ children }) {
  return (
    <>
      {children}
    </>
  )
}
