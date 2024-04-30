'use client'

import AuthenticatedPage from '@/components/layout/authenticatedPage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getTokenBalances } from '@/helpers/tokenBalances'
import { createVault } from '@/helpers/vaultCreator'
import { api } from '@/trpc/react'
import { useWallets } from '@privy-io/react-auth'
import Link from 'next/link'
import React, { FormEvent, useState } from 'react'

export default function NewTokenIndex() {
  const { wallets } = useWallets()
  const [txHashState, setTxHashState] = useState('')
  const [form, setForm] = useState({
    tokenIndexName: '',
    tokenIndexSymbol: '',
    tokenIndexLiquidity: '',
    originChainId: '',
    tokenAddress1: '',
    valueToken1: 0,
    percentageToken1: '',
    tokenAddress2: '',
    valueToken2: 0,
    percentageToken2: '',
    tokenAddress3: '',
    valueToken3: 0,
    percentageToken3: '',
  })

  const generateProof = api.zkproof.generateProof.useMutation()
  const createTokenIndex = api.zkproof.createIndex.useMutation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))
  }

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percentageAmount =
      (parseFloat(form.tokenIndexLiquidity) * parseFloat(e.target.value)) / 100
    switch (e.target.name) {
      case 'percentageToken1':
        setForm((prevForm) => ({
          ...prevForm,
          percentageToken1: e.target.value,
          valueToken1: percentageAmount,
        }))
        break
      case 'percentageToken2':
        setForm((prevForm) => ({
          ...prevForm,
          percentageToken2: e.target.value,
          valueToken2: percentageAmount,
        }))
        break
      case 'percentageToken3':
        setForm((prevForm) => ({
          ...prevForm,
          percentageToken3: e.target.value,
          valueToken3: percentageAmount,
        }))
        break
    }
  }

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    if (wallets[0]) {
      const { userBalances, totalTokensAmount } = await getTokenBalances(wallets[0]?.address)
      console.log(userBalances)
      const result = await generateProof.mutateAsync({
        circuitId: 'ffe75ba7-cbd9-4d0c-896c-a69af92e1c7f',
        proofInput: `{"balances": [${userBalances[0]?.ethValue},${userBalances[1]?.ethValue},${userBalances[2]?.ethValue}], "total": ${totalTokensAmount}}`,
      })
      console.log(result)
      const vaultHash = await createVault(
        wallets[0],
        [
          '0x13741C5dF9aB03E7Aa9Fb3Bf1f714551dD5A5F8a',
          '0x4229c271c19CA5F319fb67b4BC8A40761A6d6299',
          '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
        ],
        [
          userBalances[0]?.weiValue ?? '0',
          userBalances[1]?.weiValue ?? '0',
          userBalances[2]?.weiValue ?? '0',
        ],
        form.tokenIndexName,
        form.tokenIndexSymbol,
      )
      console.log(vaultHash)
      const res = await createTokenIndex.mutateAsync({
        ...form,
        valueToken1: form.valueToken1.toString(),
        valueToken2: form.valueToken2.toString(),
        valueToken3: form.valueToken3.toString(),
        contractAddress: vaultHash,
        zkProof: result.proof.proof,
        zkProofId: result.proof_id,
      })
      console.log(res)
      // "proofInput": {"balances": [userBalances[0].ethValue,userBalances1].ethValue,userBalances[2].ethValue], "total": 400}
    }
    console.log(form)
  }

  function calculatePercentageAmount(percentage: number): number {
    // Calculate the amount that corresponds to the given percentage of the total amount
    const percentageAmount = (parseFloat(form.tokenIndexLiquidity) * percentage) / 100
    return percentageAmount
  }

  return (
    <AuthenticatedPage>
      <div className="w-full gap-y-4 md:max-w-xl lg:max-w-2xl">
        <div className="mb-8 w-full text-center">
          <h1>New Token Index</h1>
        </div>
        {txHashState && (
          <div className="flex">
            <p>New token deployed at: </p>
            <Link href={`https://sepolia.scrollscan.dev/tx/${txHashState}`}>transaction</Link>
          </div>
        )}
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col items-center gap-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
        >
          <div className="w-full space-y-2">
            <label>Token Index Name</label>
            <Input id="tokenIndexName" name="tokenIndexName" onChange={handleChange}></Input>
          </div>
          <div className="w-full space-y-2">
            <label>Token Index Symbol</label>
            <Input id="tokenIndexSymbol" name="tokenIndexSymbol" onChange={handleChange}></Input>
          </div>
          <div className="w-full space-y-2">
            <label>Initial Liquidity (USD)</label>
            <Input
              id="tokenIndexLiquidity"
              name="tokenIndexLiquidity"
              onChange={handleChange}
              type="number"
              step="0.01"
            ></Input>
          </div>
          <div className="w-full space-y-2">
            <label>Chain</label>
            <Select
              onValueChange={(value) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  originChainId: value,
                }))
              }
            >
              <SelectTrigger className="w-full text-center">
                <SelectValue placeholder="Select a network" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Networks</SelectLabel>
                  <SelectItem value="42161">Arbitrum</SelectItem>
                  <SelectItem value="8453">Base</SelectItem>
                  <SelectItem value="666666666 ">Degen Chain</SelectItem>
                  <SelectItem value="10">Optimism</SelectItem>
                  <SelectItem value="534352 ">Scroll</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full space-y-2">
            <label>Token 1</label>
            <div className="flex w-full items-center gap-x-4">
              <Input
                placeholder="Contract address"
                id="tokenAddress1"
                name="tokenAddress1"
                onChange={handleChange}
                className="w-3/5"
              ></Input>
              <Input
                placeholder="USD value"
                id="valueToken1"
                name="valueToken1"
                onChange={handleChange}
                className="w-1/5"
                value={form.valueToken1}
                disabled
              ></Input>
              <Input
                placeholder="Percentage"
                id="percentageToken1"
                name="percentageToken1"
                onChange={handlePercentageChange}
                className="w-1/5"
              ></Input>
            </div>
          </div>
          <div className="w-full space-y-2">
            <label>Token 2</label>
            <div className="flex w-full items-center gap-x-4">
              <Input
                placeholder="Contract address"
                id="tokenAddress2"
                name="tokenAddress2"
                onChange={handleChange}
                className="w-3/5"
              ></Input>
              <Input
                placeholder="USD value"
                id="valueToken2"
                name="valueToken2"
                onChange={handleChange}
                className="w-1/5"
                value={form.valueToken2}
                disabled
              ></Input>
              <Input
                placeholder="Percentage"
                id="percentageToken2"
                name="percentageToken2"
                onChange={handlePercentageChange}
                className="w-1/5"
              ></Input>
            </div>
          </div>
          <div className="w-full space-y-2">
            <label>Token 3</label>
            <div className="flex w-full items-center gap-x-4">
              <Input
                placeholder="Contract address"
                id="tokenAddress3"
                name="tokenAddress3"
                onChange={handleChange}
                className="w-3/5"
              ></Input>
              <Input
                placeholder="USD value"
                id="valueToken3"
                name="valueToken3"
                onChange={handleChange}
                className="w-1/5"
                value={form.valueToken3}
                disabled
              ></Input>
              <Input
                placeholder="Percentage"
                id="percentageToken3"
                name="percentageToken3"
                onChange={handlePercentageChange}
                className="w-1/5"
              ></Input>
            </div>
          </div>
          <Button className="h-12 text-base">Generate zkProof</Button>
        </form>
      </div>
    </AuthenticatedPage>
  )
}
