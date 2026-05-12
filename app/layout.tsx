import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SmartDoc AI - Find the Right Doctor, Instantly',
  description: 'SmartDoc AI combines advanced clinical data with patient feedback to connect you with the most qualified specialists in seconds.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background font-body-md">
        {children}
      </body>
    </html>
  )
}
