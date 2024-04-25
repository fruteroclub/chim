'use client'

import AuthenticatedPage from '@/components/layout/authenticatedPage'
import { api } from '@/trpc/react'
import { usePrivy } from '@privy-io/react-auth'
import React from 'react'

export default function Dashboard() {
  const { ready, user: privyUser } = usePrivy()
  const { data: userData } = api.user.getById.useQuery(
    { id: privyUser?.id ?? '' },
    {
      enabled: Boolean(ready && privyUser?.id),
    },
  )
  return (
    <AuthenticatedPage>
      <div className="mb-8 flex w-full items-center justify-center">
        <h1>Dashboard</h1>
      </div>
      <div className="flex w-full items-center justify-center">
        {userData && <h3>username: {userData.user?.username}</h3>}
      </div>
    </AuthenticatedPage>
  )
}
