'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function About() {
  const [settings, setSettings] = useState({})

  useEffect(() => {
    fetch('http://localhost:5000/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Failed to load settings:', err))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-gold to-amber-600 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-serif mb-6">About {settings.site_name || 'Rahma Organics'}</h1>
            <p className="text-xl">
              {settings.site_tagline || 'Pure organic care for your natural beauty'}
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-4xl font-serif text-gold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Rahma Organics was born from a passion for natural beauty and wellness. 
                We believe that what you put on your body is just as important as what you put in it.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our journey began with a simple mission: to create high-quality, organic beauty 
                products that are safe, effective, and accessible to everyone. Every product is 
                handcrafted with love using only the finest natural ingredients.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, we're proud to serve thousands of customers who trust us for their 
                natural beauty needs. Join our community and experience the Rahma difference.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg p-12 text-center">
              <div className="text-8xl mb-4">🌿</div>
              <h3 className="text-2xl font-semibold text-gold mb-2">100% Natural</h3>
              <p className="text-gray-600">Handcrafted with organic ingredients</p>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-4xl font-serif text-gold mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold mb-3">Natural & Organic</h3>
                <p className="text-gray-600">
                  We use only pure, organic ingredients sourced from nature. 
                  No harmful chemicals, ever.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition">
                <div className="text-6xl mb-4">🐰</div>
                <h3 className="text-xl font-semibold mb-3">Cruelty-Free</h3>
                <p className="text-gray-600">
                  All our products are cruelty-free and vegan. 
                  We never test on animals.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition">
                <div className="text-6xl mb-4">♻️</div>
                <h3 className="text-xl font-semibold mb-3">Sustainable</h3>
                <p className="text-gray-600">
                  We're committed to sustainability with eco-friendly 
                  packaging and ethical practices.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-lg shadow-lg p-12">
            <h2 className="text-4xl font-serif text-gold mb-8 text-center">Why Choose Us</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="text-3xl text-gold">✓</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
                  <p className="text-gray-600">
                    Every product is carefully crafted to meet the highest quality standards.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-3xl text-gold">✓</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Handmade with Love</h3>
                  <p className="text-gray-600">
                    Each item is handcrafted in small batches to ensure freshness and quality.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-3xl text-gold">✓</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Safe & Effective</h3>
                  <p className="text-gray-600">
                    Gentle on your skin, powerful in results. Suitable for all skin types.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-3xl text-gold">✓</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Customer Satisfaction</h3>
                  <p className="text-gray-600">
                    Your satisfaction is our priority. We're here to support your beauty journey.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-serif text-gold mb-6">Ready to Experience Natural Beauty?</h2>
            <a 
              href="/shop"
              className="inline-block px-8 py-4 bg-gold text-white text-lg rounded-lg hover:bg-gold/90 transition transform hover:scale-105"
            >
              Shop Our Products
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
