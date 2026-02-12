'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetch(`http://localhost:5000/api/products/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setProduct(data)
          // Fetch related products
          return fetch('http://localhost:5000/api/products')
        })
        .then(res => res.json())
        .then(data => {
          setRelatedProducts(data.filter(p => p.id !== parseInt(params.id)).slice(0, 4))
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [params.id])

  const addToCart = () => {
    // Check stock availability
    if (product.stock !== undefined && product.stock < quantity) {
      alert(`Sorry, only ${product.stock} items available in stock`)
      return
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    for (let i = 0; i < quantity; i++) {
      cart.push(product)
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('storage'))
    alert(`Added ${quantity} item(s) to cart! 🛒`)
  }

  const buyNow = () => {
    addToCart()
    router.push('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 text-center py-20">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl text-gray-600 mb-4">Product not found</p>
          <Link href="/shop" className="text-gold hover:underline">Back to Shop</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-gold">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-gold">Shop</Link>
            <span className="mx-2">/</span>
            <span>{product.name}</span>
          </div>

          {/* Product Detail */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div className="rounded-lg overflow-hidden h-96">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-amber-100 to-amber-50 h-full flex items-center justify-center">
                    <span className="text-9xl">🧴</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <h1 className="text-4xl font-serif text-gold mb-4">{product.name}</h1>
                
                {product.category && (
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded mb-4">
                    {product.category}
                  </span>
                )}

                <div className="text-4xl font-bold text-gold mb-6">
                  KSh {product.price}
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  {product.description || 'Premium organic product handcrafted with natural ingredients for your beauty needs.'}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Key Benefits:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-gold mr-2">✓</span>
                      100% Natural & Organic Ingredients
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">✓</span>
                      Cruelty-Free & Vegan
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">✓</span>
                      Handcrafted with Care
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">✓</span>
                      Suitable for All Skin Types
                    </li>
                  </ul>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block font-semibold mb-2">Quantity:</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 border rounded hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  {product.stock !== undefined && product.stock < 1 ? (
                    <button
                      disabled
                      className="flex-1 px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={addToCart}
                        className="flex-1 px-6 py-3 border-2 border-gold text-gold rounded-lg hover:bg-gold hover:text-white transition"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={buyNow}
                        className="flex-1 px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition"
                      >
                        Buy Now
                      </button>
                    </>
                  )}
                </div>

                {/* Stock Info */}
                {product.stock !== undefined && (
                  <div className="mt-4 text-sm text-gray-600">
                    {product.stock > 0 ? (
                      <span className="text-green-600">✓ In Stock ({product.stock} available)</span>
                    ) : (
                      <span className="text-red-600">✗ Out of Stock</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-serif text-gold mb-6">You May Also Like</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {relatedProducts.map(p => (
                  <Link key={p.id} href={`/product/${p.id}`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
                      <div className="h-40 overflow-hidden">
                        {p.image ? (
                          <img 
                            src={p.image} 
                            alt={p.name}
                            className="w-full h-full object-cover hover:scale-110 transition duration-300"
                          />
                        ) : (
                          <div className="bg-gradient-to-br from-amber-100 to-amber-50 h-full flex items-center justify-center">
                            <span className="text-5xl">🧴</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{p.name}</h3>
                        <span className="text-xl font-bold text-gold">KSh {p.price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
