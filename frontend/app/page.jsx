'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        // Get featured products first, or fallback to first 3 products
        const featured = data.filter(p => p.is_featured).slice(0, 3)
        setFeaturedProducts(featured.length > 0 ? featured : data.slice(0, 3))
      })
      .catch(() => {})
  }, [])

  return (
    <main className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 bg-gradient-to-br from-white via-amber-50 to-white">
        <div className="text-center px-4 max-w-4xl">
          <div className="mb-6 animate-fade-in">
            <span className="text-6xl">🌿</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif text-gold mb-6 animate-slide-up">
            Rahma Organics
          </h1>
          <p className="text-xl md:text-3xl text-gray-700 mb-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
            Pure Organic Care for Hair, Skin & Body
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.4s'}}>
            Discover the power of nature with our handcrafted organic beauty products. 
            100% natural, cruelty-free, and made with love.
          </p>
          <div className="flex gap-4 justify-center animate-slide-up" style={{animationDelay: '0.6s'}}>
            <Link 
              href="/shop"
              className="px-8 py-4 bg-gold text-white text-lg rounded-lg hover:bg-gold/90 transition transform hover:scale-105"
            >
              Shop Now
            </Link>
            <Link 
              href="/about"
              className="px-8 py-4 border-2 border-gold text-gold text-lg rounded-lg hover:bg-gold hover:text-white transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-center text-gold mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: '🌿', title: '100% Organic', desc: 'Pure natural ingredients' },
              { icon: '✨', title: 'Handcrafted', desc: 'Made with love and care' },
              { icon: '🚫', title: 'Cruelty-Free', desc: 'Never tested on animals' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Delivered to your door' },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-lg hover:shadow-xl transition transform hover:-translate-y-2">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-center text-gold mb-12">Featured Products</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
                  <div className="h-64 overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition duration-300"
                      />
                    ) : (
                      <div className="bg-gradient-to-br from-amber-100 to-amber-50 h-full flex items-center justify-center">
                        <span className="text-8xl">🧴</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gold">KSh {product.price}</span>
                      <span className="px-4 py-2 bg-gold text-white rounded hover:bg-gold/90 transition">
                        View Details
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              href="/shop"
              className="inline-block px-8 py-4 bg-gold text-white text-lg rounded-lg hover:bg-gold/90 transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif text-center text-gold mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Amina K.', text: 'Best organic products I\'ve ever used! My skin has never felt better.', rating: 5 },
              { name: 'Sarah M.', text: 'Love the hair oil! Natural ingredients that actually work.', rating: 5 },
              { name: 'Fatima H.', text: 'Fast delivery and amazing quality. Highly recommend!', rating: 5 },
            ].map((review, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-lg">
                <div className="text-gold mb-2">{'⭐'.repeat(review.rating)}</div>
                <p className="text-gray-700 mb-4 italic">"{review.text}"</p>
                <p className="font-semibold">- {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gold to-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif mb-6">Ready to Transform Your Beauty Routine?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers who trust Rahma Organics</p>
          <Link 
            href="/shop"
            className="inline-block px-8 py-4 bg-white text-gold text-lg rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
