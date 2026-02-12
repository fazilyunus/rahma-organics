'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Footer() {
  const [settings, setSettings] = useState({})

  useEffect(() => {
    fetch('http://localhost:5000/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Failed to load settings:', err))
  }, [])

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-serif text-gold mb-4">
            {settings.site_name || 'Rahma Organics'}
          </h3>
          <p className="text-gray-400">
            {settings.site_tagline || 'Pure organic care for your natural beauty'}
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/shop" className="hover:text-gold transition">Shop</Link></li>
            <li><Link href="/about" className="hover:text-gold transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-gold transition">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Customer Service</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/shipping" className="hover:text-gold transition">Shipping Info</Link></li>
            <li><Link href="/returns" className="hover:text-gold transition">Returns</Link></li>
            <li><Link href="/privacy" className="hover:text-gold transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-gold transition">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Connect With Us</h4>
          <div className="flex gap-4 text-2xl mb-4">
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition">📘</a>
            )}
            {settings.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition">📷</a>
            )}
            {settings.twitter_url && (
              <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition">🐦</a>
            )}
            {settings.whatsapp_number && (
              <a href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition">💬</a>
            )}
          </div>
          {settings.contact_phone && (
            <p className="text-gray-400 mb-2">📞 {settings.contact_phone}</p>
          )}
          {settings.contact_email && (
            <p className="text-gray-400">📧 {settings.contact_email}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
        <p>&copy; 2026 {settings.site_name || 'Rahma Organics'}. All rights reserved.</p>
      </div>
    </footer>
  )
}
