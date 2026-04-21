import type { Metadata } from 'next'
import { Poppins, Manrope } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'elihu imóveis — Dashboard de Visitas',
  description: 'Painel de controle e métricas de visitas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  )
}
