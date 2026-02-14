import '@backstage/ui/css/styles.css'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Sidebar } from '@/components/Sidebar'

export const metadata = {
  title: 'ContribFest',
  description: 'Backstage ContribFest Resources',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Sidebar />
            <main
              style={{
                flex: 1,
                padding: '32px',
                background: 'var(--bui-bg-popover, #ffffff)',
                overflowY: 'auto',
              }}
            >
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
