import "./globals.css"

export const metadata = {
  title: "Calculator.net - Free Online Calculators",
  description: "Free online calculators for math, finance, fitness, and more",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
