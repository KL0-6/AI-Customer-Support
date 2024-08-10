import './globals.css'

import React from 'react'

import './globals.css'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </head>
        <body>
            <div className="grid place-items-center min-h-screen font-inter">
                {children}
            </div>
        </body>
    </html>
  )
}