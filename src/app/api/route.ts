import { db } from '@/server/db'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  const contractAddress = req.nextUrl.searchParams.get('contractAddress')
  try {
    const tokenIndex = await db.tokenIndex.findFirst({
      where: {
        contractAddress: contractAddress,
      },
    })

    return NextResponse.json(
      { tokenIndex, proof: tokenIndex?.zkProof, proofId: tokenIndex?.zkProofId },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { error: String(error), contractAddress: contractAddress },
      { status: 400 },
    )
  }
}
