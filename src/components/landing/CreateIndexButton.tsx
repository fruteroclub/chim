'use client'

import { Button } from '@/components/ui/button'
import { useLogin } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'

export default function CreateIndexButton() {
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
        router.push('/')
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
    <Button onClick={login} size="lg" className={`z-10 mt-4 !h-12 text-xl tracking-wide md:mt-8`}>
      Create my index
    </Button>
  )
}
