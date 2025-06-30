import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Calculator.net
        </Link>
        <Link href="/signin" className="text-sm hover:underline">
          sign in
        </Link>
      </div>
    </header>
  )
}
