import React from 'react'
import { STORE_NAME, STORE_TAGLINE } from '@/lib/secret'

export const metadata = {
  title: `About | ${STORE_NAME} - ${STORE_TAGLINE}`,
  description: `Explore About page on ${STORE_NAME}, ${STORE_TAGLINE}.`,
}

export default function AboutLayout({ children }) {
  return (
    <>
      {children}
    </>
  )
}
