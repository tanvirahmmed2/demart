import React from 'react'
import { STORE_NAME, STORE_TAGLINE } from '@/lib/secret'

export const metadata = {
  title: `Register | ${STORE_NAME} - ${STORE_TAGLINE}`,
  description: `Explore Register page on ${STORE_NAME}, ${STORE_TAGLINE}.`,
}

export default function RegisterLayout({ children }) {
  return (
    <>
      {children}
    </>
  )
}
