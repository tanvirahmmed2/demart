import React from 'react'
import { STORE_NAME, STORE_TAGLINE } from '@/lib/secret'

export const metadata = {
  title: `Track Order | ${STORE_NAME} - ${STORE_TAGLINE}`,
  description: `Track your shipment on ${STORE_NAME}, ${STORE_TAGLINE}.`,
}

export default function TrackOrderLayout({ children }) {
  return (
    <>
      {children}
    </>
  )
}
