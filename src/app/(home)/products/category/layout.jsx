import React from 'react'
import { STORE_NAME, STORE_TAGLINE } from '@/lib/secret'

export const metadata = {
  title: `Product Categories | ${STORE_NAME} - ${STORE_TAGLINE}`,
  description: `Explore Product Categories page on ${STORE_NAME}, ${STORE_TAGLINE}.`,
}

export default function ProductsCategoryLayout({ children }) {
  return (
    <>
      {children}
    </>
  )
}
