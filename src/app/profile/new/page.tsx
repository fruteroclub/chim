'use client'

import AuthenticatedPage from '@/components/layout/authenticatedPage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/trpc/react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import React, { type ChangeEvent, useState } from 'react'
import { toast } from 'sonner'

type FormState = {
  rollupName: string
  subdomain: string
  chainId: string
}

export default function NewUser() {
  const [form, setForm] = useState<FormState>({
    rollupName: '',
    subdomain: 'test',
    chainId: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const { user: userData } = usePrivy()
  const { wallets } = useWallets()
  const router = useRouter()

  const createUser = api.user.create.useMutation()

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))
  }

  async function handleDeployRollup() {
    if (!form.rollupName || !form.chainId) {
      return toast.warning('All fields are required!')
    }
    if (!userData?.id) {
      return toast.error('No user detected, please login again')
    }

    try {
      setIsLoading(true)

      if (!wallets || wallets.length < 1 || wallets[0]?.address) {
        toast.warning('No wallet detected')
        return
      }
      const { user, errorMsg } = await createUser.mutateAsync({
        id: '',
        extWallet: wallets[0]?.address ?? '',
      })
      if (!user || errorMsg) {
        toast.warning(errorMsg ?? 'An error occurred while deploying Rollup, please try again...')
        return
      }
      toast.success(`New user created`)
      router.push('/dashboard')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong, please check the logs')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthenticatedPage>
      <div className="flex w-full flex-col gap-y-6 md:max-w-2xl lg:max-w-3xl xl:max-w-5xl">
        <div className="flex w-full items-center justify-center">
          <h2>Create Profile</h2>
        </div>
        <div className="w-full space-y-2">
          <div className="grid grid-cols-3 gap-x-8">
            <p className="col-span-1 text-xl">Set identifiers</p>
            <form className="bg-card text-card-foreground col-span-2 flex flex-col gap-y-4 rounded-lg border p-6 shadow-sm">
              <div className="w-full space-y-2">
                <label htmlFor="rollupName" className="text-lg font-medium">
                  Rollup Name
                </label>
                <Input id="rollupName" name="rollupName" onChange={handleInputChange} />
              </div>
              <div className="w-full space-y-2">
                <label htmlFor="chainId" className="text-lg font-medium">
                  Chain ID
                </label>
                <Input id="chainId" name="chainId" onChange={handleInputChange} />
              </div>
            </form>
          </div>
        </div>
        <div className="w-full space-y-2">
          <div className="grid grid-cols-3 gap-x-8">
            <p className="col-span-1 text-xl"></p>
            <div className="col-span-2">
              <Button
                size="lg"
                className="!h-12 w-full text-lg"
                onClick={handleDeployRollup}
                disabled={isLoading}
              >
                {isLoading ? 'Deploying...' : 'Deploy Rollup'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedPage>
  )
}
