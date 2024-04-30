import { formatEther, parseEther } from 'viem'

const BaseDegenBridgeContract = '0x43019F8BE1F192587883b67dEA2994999f5a2de2'

const url =
  process.env.NEXT_PUBLIC_ALCHEMY_API_URL ?? 'https://base-mainnet.g.alchemy.com/v2/docs-demo'

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

export async function getTokenBalances(address: string) {
  console.log(process.env.ALCHEMY_API_URL)
  try {
    const body = JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'alchemy_getTokenBalances',
      params: [
        // address,
        '0xE3185Fd6d325a625D2b4bE324fE9175C4E4DfE93',
        [
          '0x13741C5dF9aB03E7Aa9Fb3Bf1f714551dD5A5F8a',
          '0x4229c271c19CA5F319fb67b4BC8A40761A6d6299',
          '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
        ],
      ],
    })

    const res = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    })
    const data = await res.json()
    const tokenBalances = data.result.tokenBalances as tokenBalance[]
    const userBalances = tokenBalances.map((tokenData) => ({
      contractAddress: tokenData.contractAddress,
      ethValue: parseInt(formatEther(BigInt(tokenData.tokenBalance))),
      weiValue: BigInt(tokenData.tokenBalance).toString(10),
    }))

    const totalTokensAmount = userBalances.reduce((total, userBalance) => {
      return total + userBalance.ethValue
    }, 0)

    return { userBalances, totalTokensAmount }
  } catch (error) {
    console.log(error)
    return { userBalances: [], totalTokensAmount: 0 }
  }
}

type tokenBalance = {
  contractAddress: string
  tokenBalance: string
}
