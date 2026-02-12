'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Contact() {
  const [settings, setSettings] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  useEffect(() => {
    fetch('http://localhost:5000/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Failed to load settings:', err))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-5xl font-serif text-gold mb-8 text-center">Contact Us</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows="5"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gold text-white py-3 rounded-lg hover:bg-gold/90 transition"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                <div className="space-y-4">
                  {settings.contact_address && (
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📍</span>
                      <div>
                        <h3 className="font-semibold">Address</h3>
                        <p className="text-gray-600">{settings.contact_address}</p>
                      </div>
                    </div>
                  )}

                  {settings.contact_phone && (
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📞</span>
                      <div>
                        <h3 className="font-semibold">Phone</h3>
                        <p className="text-gray-600">{settings.contact_phone}</p>
                      </div>
                    </div>
                  )}

                  {settings.contact_email && (
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📧</span>
                      <div>
                        <h3 className="font-semibold">Email</h3>
                        <p className="text-gray-600">{settings.contact_email}</p>
                      </div>
                    </div>
                  )}

                  {settings.business_hours && (
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <h3 className="font-semibold">Business Hours</h3>
                        <p className="text-gray-600">{settings.business_hours}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gold text-white rounded-lg shadow-lg p-8 text-center">
                <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
                <div className="flex justify-center gap-6 text-3xl">
                  {settings.facebook_url && (
                    <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">📘</a>
                  )}
                  {settings.instagram_url && (
                    <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">📷</a>
                  )}
                  {settings.twitter_url && (
                    <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">🐦</a>
                  )}
                  {settings.whatsapp_number && (
                    <a href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition">💬</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
