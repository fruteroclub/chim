'use client'

import { useLogin } from '@privy-io/react-auth'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

type LoginButtonProps = {
  text?: string
}

export default function LoginButton({ text = 'Login' }: LoginButtonProps) {
  const router = useRouter()
  const { login } = useLogin({
    // Set up an `onComplete` callback to run when `login` completes
    onComplete(user, isNewUser, wasPreviouslyAuthenticated) {
      console.log('🔑 ✅ Login success', {
        user,
        isNewUser,
        wasPreviouslyAuthenticated,
      })
      if (isNewUser) {
        router.push('/dashboard')
        return
      }
      if (!wasPreviouslyAuthenticated) router.push('/dashboard')
    },
    // Set up an `onError` callback to run when there is a `login` error
    onError(error) {
      console.log('🔑 🚨 Login error', { error })
    },
  })
  return (
    <Button size="lg" className="h-12 text-lg" onClick={login}>
      {text}
    </Button>
  )
}
