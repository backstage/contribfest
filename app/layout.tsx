import '@backstage/ui/css/styles.css'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LayoutShell } from '@/components/LayoutShell'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'

export const metadata = {
  title: 'Backstage ContribFest',
  description: 'Backstage ContribFest Resources',
  icons: {
    icon: `/favicon.ico`,
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
        <GoogleAnalytics />
        <ThemeProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          <LayoutShell>{children}</LayoutShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
