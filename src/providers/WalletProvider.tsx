'use client'

import { PrivyProvider } from '@privy-io/react-auth'

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? 'clviud44n00vv12igc8tyxe3t'}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#3730a3',
          logo: 'https://i.ibb.co/gPVq7Sv/kukulcan-auth.png',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'off',
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
