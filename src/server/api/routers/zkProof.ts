import { env } from '@/env'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import axios from 'axios'
import { z } from 'zod'

const SINDRI_API_KEY = env.SINDRI_API_KEY

const axiosClient = axios.create({
  baseURL: 'https://forge.sindri.app/api/v1',
  headers: {
    Authorization: `Bearer ${SINDRI_API_KEY}`,
  },
})

axiosClient.defaults.validateStatus = function (status) {
  return status >= 200 && status < 300
}

type ProofDetailResponse = {
  status: 'Ready' | 'Failed'
  error?: string
  proof: {
    proof: string
  }
  proof_id: string
}

type ProveResponse = {
  proof_id: string
}

export const zkRouter = createTRPCRouter({
  generateProof: publicProcedure
    .input(
      z.object({
        circuitId: z.string().min(1),
        proofInput: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const { circuitId, proofInput } = input

      const { data: proveResponse } = await axiosClient.post<ProveResponse>(
        `/circuit/${circuitId}/prove`,
        {
          proof_input: proofInput,
        },
      )

      const proofId = proveResponse.proof_id
      const startTime = Date.now()

      while (true) {
        const { data: proofDetailResponse } = await axiosClient.get<ProofDetailResponse>(
          `/proof/${proofId}/detail`,
        )
        if (proofDetailResponse.status === 'Ready') {
          return proofDetailResponse
        } else if (proofDetailResponse.status === 'Failed') {
          throw new Error(`Proof generation failed: ${proofDetailResponse.error}`)
        } else if (Date.now() - startTime > 30 * 60 * 1000) {
          throw new Error('Proof generation timed out after 30 minutes.')
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }),

  createIndex: publicProcedure
    .input(
      z.object({
        tokenIndexName: z.string().min(1),
        tokenIndexSymbol: z.string().min(1),
        tokenIndexLiquidity: z.string().min(1),
        originChainId: z.string().min(1),
        tokenAddress1: z.string().min(1),
        valueToken1: z.string().min(1),
        percentageToken1: z.string().min(1),
        tokenAddress2: z.string().min(1),
        valueToken2: z.string().min(1),
        percentageToken2: z.string().min(1),
        tokenAddress3: z.string().min(1),
        valueToken3: z.string().min(1),
        percentageToken3: z.string().min(1),
        contractAddress: z.string().min(1),
        zkProof: z.string().min(1),
        zkProofId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const newTokenIndex = await ctx.db.tokenIndex.create({
          data: {
            name: input.tokenIndexName,
            symbol: input.tokenIndexSymbol,
            liquidity: parseFloat(input.tokenIndexLiquidity),
            originChainId: parseInt(input.originChainId),
            tokenAddress1: input.tokenAddress1,
            valueToken1: parseFloat(input.valueToken1),
            percentageToken1: parseFloat(input.percentageToken1),
            tokenAddress2: input.tokenAddress2,
            valueToken2: parseFloat(input.valueToken2),
            percentageToken2: parseFloat(input.percentageToken2),
            tokenAddress3: input.tokenAddress3,
            valueToken3: parseFloat(input.valueToken3),
            percentageToken3: parseFloat(input.percentageToken3),
            contractAddress: input.contractAddress,
            zkProof: input.zkProof,
            zkProofId: input.zkProofId,
          },
        })
        return { newTokenIndex }
      } catch (error) {
        console.log(error)
        return { newTokenIndex: null }
      }
    }),
})
