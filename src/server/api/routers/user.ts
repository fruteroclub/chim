import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        extWallet: z.string().min(1),
        username: z.string().min(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, extWallet, username } = input
        const newUser = await ctx.db.user.create({
          data: {
            id,
            extWallet,
            username,
          },
        })

        return { user: newUser }
      } catch (error) {
        console.log(error)
        return { error, errorMsg: 'Something went wrong' }
      }
    }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: { id: input.id },
        })
        if (user) {
          return { user }
        } else {
          return { user: null, message: 'No user found' }
        }
      } catch (error) {
        console.log(error)
        return { error, errorMsg: 'Something went wrong' }
      }
    }),
})
