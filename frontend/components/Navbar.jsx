'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    updateCart()
    checkAuth()
    
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('storage', updateCart)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('storage', updateCart)
    }
  }, [])

  const updateCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartCount(cart.length)
  }

  const checkAuth = async () => {
    const token = localStorage.getItem('customerToken')
    if (token) {
      try {
        const res = await fetch('http://localhost:5000/api/customers/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const user = await res.json()
          setIsLoggedIn(true)
          setUserName(user.name.split(' ')[0]) // First name only
        } else {
          localStorage.removeItem('customerToken')
        }
      } catch (err) {
        console.error('Auth check failed')
      }
    }
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-sm py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-serif text-gold hover:text-gold/80 transition">
          Rahma Organics
        </Link>
        
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/" className="hover:text-gold transition">Home</Link>
          <Link href="/shop" className="hover:text-gold transition">Shop</Link>
          <Link href="/about" className="hover:text-gold transition">About</Link>
          <Link href="/contact" className="hover:text-gold transition">Contact</Link>
        </div>

        <div className="flex gap-4 items-center">
          <Link href="/cart" className="relative hover:text-gold transition">
            <span className="text-2xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/account" className="hover:text-gold transition flex items-center gap-2">
            <span className="text-2xl">👤</span>
            {isLoggedIn && (
              <span className="hidden md:inline text-sm font-semibold">{userName}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}
