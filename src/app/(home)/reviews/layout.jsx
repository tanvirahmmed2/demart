import React from 'react'
import { STORE_NAME, STORE_TAGLINE } from '@/lib/secret'

export const metadata = {
  title: `Reviews | ${STORE_NAME} - ${STORE_TAGLINE}`,
  description: `Explore Customer Reviews on ${STORE_NAME}, ${STORE_TAGLINE}.`,
}

export default function ReviewsLayout({ children }) {
  return (
    <>
      {children}
    </>
  )
}
