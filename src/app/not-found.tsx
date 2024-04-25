import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="page items-center justify-center px-4 !pt-32 text-center">
      <h2 className={`text-5xl tracking-tight`}>404 | Not found</h2>
      <p className="mt-4 text-2xl">Looks like you&apos;re lost...</p>
      <Link href="/">
        <Button className={`mt-6 text-lg md:mt-8 md:text-xl lg:mt-8 xl:mt-12`}>Go home</Button>
      </Link>
    </div>
  )
}
