'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Cart() {
  const [cart, setCart] = useState([])
  const [phone, setPhone] = useState('')
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadCart()
    window.addEventListener('storage', loadCart)
    return () => window.removeEventListener('storage', loadCart)
  }, [])

  const loadCart = () => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(cartData)
  }

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index)
    localStorage.setItem('cart', JSON.stringify(newCart))
    setCart(newCart)
    window.dispatchEvent(new Event('storage'))
  }

  const updateQuantity = (index, change) => {
    // This is simplified - in real app, track quantities properly
    if (change > 0) {
      const newCart = [...cart, cart[index]]
      localStorage.setItem('cart', JSON.stringify(newCart))
      setCart(newCart)
    } else if (cart.length > 0) {
      removeItem(index)
    }
  }

  const getCartSummary = () => {
    const items = {}
    cart.forEach(item => {
      if (items[item.id]) {
        items[item.id].quantity++
      } else {
        items[item.id] = { ...item, quantity: 1 }
      }
    })
    return Object.values(items)
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + parseFloat(item.price), 0)
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!')
      return
    }

    if (!phone || phone.length < 10) {
      alert('Please enter a valid phone number')
      return
    }

    setProcessing(true)

    try {
      const token = localStorage.getItem('customerToken')
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }

      // Create order
      const orderRes = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          total: getTotal(),
          items: getCartSummary()
        })
      })

      const order = await orderRes.json()

      // Initiate M-Pesa payment
      const paymentRes = await fetch('http://localhost:5000/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.startsWith('254') ? phone : `254${phone.replace(/^0/, '')}`,
          amount: getTotal(),
          orderId: order.id
        })
      })

      const payment = await paymentRes.json()

      if (payment.success) {
        alert('Payment request sent! Please check your phone to complete payment. 📱')
        localStorage.setItem('cart', JSON.stringify([]))
        setCart([])
        window.dispatchEvent(new Event('storage'))
        
        // Redirect to account if logged in, otherwise to home
        if (token) {
          router.push('/account')
        } else {
          router.push('/')
        }
      } else {
        alert('Payment initiation failed. Please try again.')
      }
    } catch (error) {
      alert('Checkout failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const cartSummary = getCartSummary()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-serif text-gold mb-8">Shopping Cart</h1>

          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
              <Link 
                href="/shop"
                className="inline-block px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow">
                  {cartSummary.map((item, index) => (
                    <div key={index} className="p-6 border-b last:border-b-0 flex gap-4">
                      <div className="w-24 h-24 rounded flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="bg-gradient-to-br from-amber-100 to-amber-50 w-full h-full flex items-center justify-center">
                            <span className="text-4xl">🧴</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Link href={`/product/${item.id}`}>
                          <h3 className="text-lg font-semibold hover:text-gold transition cursor-pointer">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-gold">KSh {item.price}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(cart.findIndex(i => i.id === item.id), -1)}
                              className="w-8 h-8 border rounded hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(cart.findIndex(i => i.id === item.id), 1)}
                              className="w-8 h-8 border rounded hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(cart.findIndex(i => i.id === item.id))}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                  <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>KSh {getTotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-gold">KSh {getTotal()}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block font-semibold mb-2">M-Pesa Phone Number</label>
                    <input
                      type="tel"
                      placeholder="0712345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    />
                    <p className="text-xs text-gray-500 mt-1">You'll receive an STK push to complete payment</p>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={processing}
                    className="w-full px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition disabled:bg-gray-400"
                  >
                    {processing ? 'Processing...' : 'Proceed to Checkout'}
                  </button>

                  <Link 
                    href="/shop"
                    className="block text-center mt-4 text-gold hover:underline"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
