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
})
