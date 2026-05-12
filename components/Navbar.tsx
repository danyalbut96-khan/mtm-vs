'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const navLink = (href: string, label: string) => {
    const active = pathname === href
    return (
      <Link
        href={href}
        className={`font-body-md text-body-md transition-colors duration-200 ${
          active
            ? 'text-primary font-bold border-b-2 border-primary pb-1'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <header className="bg-surface border-b border-outline-variant shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center h-[72px] px-gutter max-w-container-max mx-auto w-full">
        <Link href="/" className="flex items-center gap-xs">
          <span className="font-display-lg text-headline-md font-bold text-primary">SmartDoc AI</span>
        </Link>

        <nav className="hidden md:flex gap-md">
          {navLink('/', 'Home')}
          {navLink('/search', 'Find Doctor')}
          {navLink('/doctors/register', 'For Doctors')}
        </nav>

        <div className="flex items-center gap-sm">
          <Link
            href="/auth"
            className="font-body-md text-body-md text-primary px-sm py-xs hover:bg-surface-container transition-all active:opacity-80 active:scale-95 rounded"
          >
            Login
          </Link>
          <Link
            href="/auth?tab=signup"
            className="font-body-md text-body-md bg-primary-container text-on-primary-container px-md py-xs rounded-xl hover:shadow-lg transition-all active:opacity-80 active:scale-95"
          >
            Signup
          </Link>
        </div>
      </div>
    </header>
  )
}
