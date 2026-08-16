import React from 'react'
import { STORE_NAME, STORE_TAGLINE } from '@/lib/secret'

export const metadata = {
  title: `Products | ${STORE_NAME} - ${STORE_TAGLINE}`,
  description: `Explore Products page on ${STORE_NAME}, ${STORE_TAGLINE}.`,
}

export default function ProductsLayout({ children }) {
  return (
    <>
      {children}
    </>
  )
}
