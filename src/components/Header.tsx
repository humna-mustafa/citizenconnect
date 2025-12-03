'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { subscribeToNotifications } from '@/lib/supabase/helpers'
import type { User } from '@supabase/supabase-js'
import { Menu, X, User as UserIcon, Bell, Settings, LogOut, ChevronDown } from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Issue Guides', href: '/guides' },
  { name: 'Blood Bank', href: '/blood-bank' },
  { name: 'Donations', href: '/donations' },
  { name: 'Volunteers', href: '/volunteers' },
  { name: 'Emergency', href: '/emergency' },
  { name: 'Report Issue', href: '/report-issue' },
  { name: 'Dashboard', href: '/dashboard' },
]

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  useEffect(() => {
    if (user) {
      // Fetch initial count
      const fetchUnread = async () => {
        const { count } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false)
        setUnreadCount(count || 0)
      }
      fetchUnread()

      // Subscribe to real-time notifications
      const channel = subscribeToNotifications(user.id, () => {
        setUnreadCount(prev => prev + 1)
      })

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsProfileOpen(false)
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-border shadow-sm' : 'bg-background border-transparent'
      }`}
    >
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16 lg:h-20'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-3 group'>
            <div className='relative w-10 h-10 lg:w-12 lg:h-12 transition-transform group-hover:scale-105'>
              <Image 
                src='/CitizenConnect.svg' 
                alt='CitizenConnect Logo' 
                fill
                className='object-contain'
              />
            </div>
            <div className='hidden sm:block'>
              <h1 className='text-xl lg:text-2xl font-bold text-foreground tracking-tight'>
                Citizen<span className='text-primary'>Connect</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden xl:flex items-center gap-1'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === item.href ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons / Profile */}
          <div className='flex items-center gap-3'>
            {user ? (
              <div className='flex items-center gap-4'>
                {/* Notification Bell */}
                <Link href="/notifications" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"></span>
                  )}
                </Link>

                <div className='relative'>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className='flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-colors border border-transparent hover:border-border'
                  >
                    <div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm'>
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isProfileOpen && (
                    <div className='absolute right-0 top-full mt-2 w-64 bg-popover rounded-xl shadow-xl border border-border py-2 animate-in fade-in slide-in-from-top-2'>
                      <div className='px-4 py-3 border-b border-border'>
                        <p className='font-medium text-foreground truncate'>{user.email}</p>
                        <p className='text-xs text-muted-foreground'>Member</p>
                      </div>
                      <div className='p-1'>
                        <Link 
                          href='/profile' 
                          onClick={() => setIsProfileOpen(false)}
                          className='flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors'
                        >
                          <UserIcon className='w-4 h-4' />
                          My Profile
                        </Link>
                        <Link 
                          href='/notifications' 
                          onClick={() => setIsProfileOpen(false)}
                          className='flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors'
                        >
                          <Bell className='w-4 h-4' />
                          Notifications
                          {unreadCount > 0 && (
                            <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </Link>
                        <Link 
                          href='/settings' 
                          onClick={() => setIsProfileOpen(false)}
                          className='flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors'
                        >
                          <Settings className='w-4 h-4' />
                          Settings
                        </Link>
                      </div>
                      <div className='border-t border-border mt-1 p-1'>
                        <button
                          onClick={handleSignOut}
                          className='w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-destructive/10 text-sm text-destructive transition-colors'
                        >
                          <LogOut className='w-4 h-4' />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='hidden sm:flex items-center gap-3'>
                <Link
                  href='/auth/login'
                  className='px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
                >
                  Login
                </Link>
                <Link
                  href='/auth/signup'
                  className='px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 shadow-sm transition-colors'
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='xl:hidden p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors'
            >
              {isMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='xl:hidden bg-background border-t border-border py-4 animate-in slide-in-from-top-2'>
            <nav className='flex flex-col gap-1 px-2'>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-md font-medium transition-colors ${pathname === item.href ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                >
                  {item.name}
                </Link>
              ))}
              {!user && (
                <div className='grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border px-2'>
                  <Link
                    href='/auth/login'
                    onClick={() => setIsMenuOpen(false)}
                    className='px-4 py-2.5 text-center text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors'
                  >
                    Login
                  </Link>
                  <Link
                    href='/auth/signup'
                    onClick={() => setIsMenuOpen(false)}
                    className='px-4 py-2.5 text-center text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors'
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
