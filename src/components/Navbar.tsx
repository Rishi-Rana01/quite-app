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

  const isActive = (path: string) => pathname === path

  return (
    <nav className='relative w-full border-b border-primary/20 bg-background/70 backdrop-blur-md shadow-[0_2px_20px_rgba(0,255,157,0.05)]'>
      {/* Top neon accent line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center px-4 py-3 md:py-4'>
        {/* Brand */}
        <Link href="/" className='text-xl font-bold tracking-widest uppercase text-primary drop-shadow-[0_0_8px_rgba(0,255,157,0.4)] mb-3 md:mb-0 hover:drop-shadow-[0_0_12px_rgba(0,255,157,0.7)] transition-all'>
          Quite-App
        </Link>

        {/* Nav Links + Actions */}
        <div className='flex flex-col md:flex-row items-center gap-2 md:gap-3'>
          {/* About Link - always visible */}
          <Link href="/about">
            <Button
              variant="ghost"
              size="sm"
              className={`text-xs uppercase tracking-widest transition-all duration-200 ${isActive('/about')
                ? 'text-primary shadow-[0_0_10px_rgba(0,255,157,0.2)] border border-primary/30'
                : 'text-muted-foreground hover:text-primary hover:drop-shadow-[0_0_6px_rgba(0,255,157,0.3)]'
                }`}
            >
              About
            </Button>
          </Link>

          {session ? (
            <>
              {/* Dashboard Link */}
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs uppercase tracking-widest transition-all duration-200 ${isActive('/dashboard')
                    ? 'text-primary shadow-[0_0_10px_rgba(0,255,157,0.2)] border border-primary/30'
                    : 'text-muted-foreground hover:text-primary hover:drop-shadow-[0_0_6px_rgba(0,255,157,0.3)]'
                    }`}
                >
                  Dashboard
                </Button>
              </Link>

              {/* User greeting */}
              <span className='text-xs text-muted-foreground tracking-wider hidden md:inline-block border-l border-border/50 pl-3 ml-1'>
                <span className="text-primary/70">▶</span> {user?.username || user?.email}
              </span>

              {/* Logout */}
              <Button
                size="sm"
                variant="outline"
                className='text-xs uppercase tracking-widest border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive transition-all'
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button
                size="sm"
                variant="outline"
                className='text-xs uppercase tracking-widest border-primary/40 text-primary hover:bg-primary/10 hover:shadow-neon-sm transition-all'
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar