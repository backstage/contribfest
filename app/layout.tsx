import '@backstage/ui/css/styles.css'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Sidebar } from '@/components/Sidebar'

export const metadata = {
  title: 'ContribFest',
  description: 'Backstage ContribFest Resources',
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
                background: 'var(--bg-primary, #ffffff)',
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
