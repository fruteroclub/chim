'use client'

import { Input } from '@/components/ui/input'
import { api } from '@/trpc/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'

type NewUserPageProps = {
  privyUserId: string
  wallet: string
  refetchUserData: () => Promise<void>
}

export default function NewUserPage({ privyUserId, wallet, refetchUserData }: NewUserPageProps) {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const createUser = api.user.create.useMutation()

  async function onSubmitHandler(event: React.FormEvent) {
    event?.preventDefault()
    if (!username || username.length < 5) {
      toast.warning('Min username length is 5 characters')
      return
    }
    if (username.length > 32) {
      toast.warning('Max 32 characters!')
      return
    }
    setIsLoading(true)
    if (!wallet) {
      toast.error('Missing wallet data, unable to create user')
      setIsLoading(false)
      return
    }
    try {
      const { user, errorMsg } = await createUser.mutateAsync({
        id: privyUserId,
        extWallet: wallet,
        username,
      })
      if (!user || errorMsg) {
        toast.warning(errorMsg ?? 'An error occurred while creating User, please try again...')
        return
      }
      toast.success('New user created')
      await refetchUserData()
      router.push('/dashboard')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong, please check the logs')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="pb-8">
        <h2>Create Profile</h2>
      </div>
      <form className="flex w-1/3 flex-col gap-y-6" onSubmit={onSubmitHandler}>
        <div className="space-y-2">
          <label htmlFor="username">Enter your username</label>
          <Input
            id="username"
            placeholder="scroll-rules"
            onChange={(event) => setUsername(event.target.value)}
            value={username}
          />
        </div>
        <Button disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Profile'}</Button>
      </form>
    </div>
  )
}
