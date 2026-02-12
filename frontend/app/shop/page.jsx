'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setFilteredProducts(data)
        const cats = ['All', ...new Set(data.map(p => p.category).filter(Boolean))]
        setCategories(cats)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      return a.name.localeCompare(b.name)
    })

    setFilteredProducts(filtered)
  }, [selectedCategory, searchQuery, sortBy, products])

  const addToCart = (product) => {
    // Check stock availability
    if (product.stock !== undefined && product.stock < 1) {
      alert('Sorry, this product is out of stock')
      return
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push(product)
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('storage'))
    alert('Added to cart! 🛒')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif text-gold mb-4">Our Products</h1>
            <p className="text-xl text-gray-600">Discover our collection of organic beauty products</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-xl text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-600">No products found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
                  <Link href={`/product/${product.id}`}>
                    <div className="h-48 cursor-pointer overflow-hidden">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-110 transition duration-300"
                        />
                      ) : (
                        <div className="bg-gradient-to-br from-amber-100 to-amber-50 h-full flex items-center justify-center">
                          <span className="text-6xl">🧴</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-lg font-semibold mb-2 hover:text-gold transition cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    {product.category && (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded mb-3">
                        {product.category}
                      </span>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gold">KSh {product.price}</span>
                      {product.stock !== undefined && product.stock < 1 ? (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed text-sm"
                        >
                          Out of Stock
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="px-4 py-2 bg-gold text-white rounded hover:bg-gold/90 transition text-sm"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                    {product.stock !== undefined && product.stock > 0 && product.stock < 10 && (
                      <p className="text-xs text-orange-600 mt-2">Only {product.stock} left in stock!</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
