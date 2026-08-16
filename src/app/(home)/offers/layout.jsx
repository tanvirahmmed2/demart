import React from 'react'
import { STORE_NAME, STORE_TAGLINE } from '@/lib/secret'

export const metadata = {
  title: `Special Offers | ${STORE_NAME} - ${STORE_TAGLINE}`,
  description: `Exclusive deals and promotional discounts on ${STORE_NAME}.`,
}

const layout = ({children}) => {
  return (
    <div>{children}</div>
  )
}

export default layout