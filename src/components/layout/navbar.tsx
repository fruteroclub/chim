'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import MobileMenu from './mobileMenu'
import { useLogin, useLogout, usePrivy } from '@privy-io/react-auth'

export default function Navbar() {
  const router = useRouter()
  const { authenticated } = usePrivy()
  const { login } = useLogin({
    // Set up an `onComplete` callback to run when `login` completes
    onComplete(user, isNewUser, wasPreviouslyAuthenticated) {
      console.log('🔑 ✅ Login success', {
        user,
        isNewUser,
        wasPreviouslyAuthenticated,
      })
      if (isNewUser) {
        router.push('/create-org')
        return
      }
      if (!wasPreviouslyAuthenticated) router.push('/dashboard')
    },
    // Set up an `onError` callback to run when there is a `login` error
    onError(error) {
      console.log('🔑 🚨 Login error', { error })
    },
  })
  const { logout } = useLogout()
  return (
    <nav className="bg-background sticky top-0 h-16">
      <div className="mx-auto flex h-full max-w-7xl justify-between px-4 md:px-8">
        <div className="flex items-center space-x-0 md:space-x-4">
          <Link href="/" className="hover:text-primary flex items-center gap-1 px-2 text-black">
            <div className="flex items-center transition duration-300 ease-in-out hover:scale-90">
              <Image src="/images/logo.png" alt="fruit rush logo" height={32} width={32} />
            </div>
            <span className={`hover:text-destructive text-3xl font-bold tracking-tighter`}>
              chim
            </span>
          </Link>
        </div>

        {/* Primary Navbar items */}
        <div className={`hidden items-center space-x-4 lg:flex`}>
          {authenticated && (
            <Link href="/dashboard">
              <Button size="sm" className={`text-md`}>
                Dashboard
              </Button>
            </Link>
          )}
          <Button
            variant={authenticated ? 'outline' : 'default'}
            size="sm"
            className={`text-md`}
            onClick={authenticated ? logout : login}
          >
            {authenticated ? 'Logout' : 'Create'}
          </Button>
        </div>

        <div className="flex items-center lg:hidden">
          <MobileMenu authenticated={authenticated} login={login} logout={logout} />
        </div>
      </div>
    </nav>
  )
}
