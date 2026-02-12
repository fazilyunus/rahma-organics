import './globals.css'

export const metadata = {
  title: 'Rahma Organics - Pure Organic Care',
  description: 'Premium organic products for hair, skin & body',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
