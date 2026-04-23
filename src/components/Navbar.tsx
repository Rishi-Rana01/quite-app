"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'

const Navbar = () => {

  const { data: session } = useSession()
  const user: User = session?.user as User
  const pathname = usePathname()

  const isDashboard = pathname === '/dashboard'

  return (
    <nav className='p-4 md:p-6 shadow-md'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        <Link href="/" className='text-xl font-bold mb-4 md:mb-0'>Quite Message</Link>
        {session ? (
          <div className='flex flex-col md:flex-row items-center gap-2 md:gap-4'>
            <span className='text-sm md:text-base'>Welcome, {user?.username || user?.email}</span>
            <Link href="/dashboard">
              <Button
                variant={isDashboard ? "default" : "outline"}
                className={`transition-all duration-200 ${isDashboard
                  ? 'shadow-sm ring-2 ring-primary/20'
                  : 'hover:bg-accent'
                  }`}
              >
                Dashboard
              </Button>
            </Link>
            <Button className='md:w-auto' onClick={() => signOut()}>Logout</Button>
          </div>
        ) : (
          <>
            <Link href="/sign-in">
              <Button className='md:w-auto' variant="outline">Login</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar   