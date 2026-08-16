import React from 'react'
import { STORE_NAME, STORE_TAGLINE } from '@/lib/secret'

export const metadata = {
  title: `Login | ${STORE_NAME} - ${STORE_TAGLINE}`,
  description: `Sign in to your account on ${STORE_NAME}.`,
}

const LoginLayout = ({children}) => {
  return (
    <div className='w-full'>{children}</div>
  )
}

export default LoginLayout