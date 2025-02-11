import { MenuIcon, SpaceIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {}

const NotFound = (props: Props) => {
  return (
   <div className="flex min-h-[100dvh] flex-col">
      <main className="flex-1 flex items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-20">
            <Image src="/icons/youtube-icon.svg" alt="/youtube" height={1080} width={1080}/>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Oops! Lost in space</h1>
          <p className="mb-8 text-gray-500 dark:text-gray-400">
            It looks like the page you're looking for has drifted off into the cosmos. Don't worry, we'll help you find
            your way back.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              prefetch={false}
            >
              Take me home
            </Link>
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-6 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
              prefetch={false}
            >
              Get in touch
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default NotFound
