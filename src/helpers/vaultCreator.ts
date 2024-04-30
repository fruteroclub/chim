import { VaultCreatorABI } from '@/lib/contracts/VaultCreatorABI'
import { ConnectedWallet } from '@privy-io/react-auth'
import { Account, createPublicClient, createWalletClient, custom, getContractAddress } from 'viem'
import { scrollSepolia } from 'viem/chains'

export async function createVault(
  wallet: ConnectedWallet,
  components: string[],
  units: string[],
  name: string,
  symbol: string,
) {
  if (!window.ethereum) {
    console.error('No ethereum object available...')
  }
  await wallet.switchChain(scrollSepolia.id)
  const provider = await wallet.getEthereumProvider()

  const walletClient = createWalletClient({
    chain: scrollSepolia,
    transport: custom(provider),
  })

  const client = createPublicClient({
    chain: scrollSepolia,
    transport: custom(provider),
  })

  const { request } = await client.simulateContract({
    account: wallet.address as `0x${string}`,
    // account: walletClient.account,
    address: '0x3F0aE0e2653309619ad71C979FA098f1eF5E9B93',
    abi: VaultCreatorABI,
    functionName: 'create',
    args: [components, units, wallet.address, name, symbol],
  })

  const hash = await walletClient.writeContract(request)
  const receipt = await client.waitForTransactionReceipt({
    hash,
  })

  const transactionCount = await client.getTransactionCount({
    address: wallet.address as `0x${string}`,
  })
  return getContractAddress({
    from: receipt.from,
    nonce: BigInt(transactionCount),
  })
}
