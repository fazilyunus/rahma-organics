'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Account() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  })
  
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('customerToken')
    if (token) {
      try {
        const res = await fetch('http://localhost:5000/api/customers/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
          setIsLoggedIn(true)
          loadOrders(token)
        } else {
          localStorage.removeItem('customerToken')
        }
      } catch (err) {
        console.error('Auth check failed:', err)
      }
    }
    setLoading(false)
  }

  const loadOrders = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/customers/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (err) {
      console.error('Failed to load orders:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const endpoint = isLogin ? '/api/customers/login' : '/api/customers/register'
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : formData

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('customerToken', data.token)
        setUser(data.user)
        setIsLoggedIn(true)
        setFormData({ name: '', email: '', password: '', phone: '' })
        if (!isLogin) {
          alert('Registration successful! Welcome to Rahma Organics! 🎉')
        }
        checkAuth()
      } else {
        setError(data.message || 'An error occurred')
      }
    } catch (err) {
      setError('Server error. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('customerToken')
    setIsLoggedIn(false)
    setUser(null)
    setOrders([])
    setFormData({ name: '', email: '', password: '', phone: '' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Logged In View
  if (isLoggedIn && user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-serif text-gold">My Account</h1>
              <button
                onClick={handleLogout}
                className="px-6 py-2 border border-gold text-gold rounded-lg hover:bg-gold hover:text-white transition"
              >
                Logout
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-gold to-amber-600 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-semibold">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  {user.phone && <p className="text-gray-600">{user.phone}</p>}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>📅</span>
                    <span className="text-sm">Member since {new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>📦</span>
                    <span className="text-sm">{orders.length} Total Orders</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/shop')}
                  className="w-full mt-6 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Orders Section */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-semibold mb-6">Order History</h2>

                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-gray-600 mb-4">No orders yet</p>
                      <button
                        onClick={() => router.push('/shop')}
                        className="px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">Order #{order.id}</h3>
                              <p className="text-sm text-gray-600">
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded text-sm ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-gold">KSh {order.total}</span>
                            <button className="text-gold hover:underline text-sm">
                              View Details →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  // Login/Register View
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">👤</div>
              <h1 className="text-3xl font-serif text-gold">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-gray-600 mt-2">
                {isLogin ? 'Login to access your account' : 'Join Rahma Organics today'}
              </p>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-semibold">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-semibold">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {!isLogin && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-semibold">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="0712345678"
                  />
                </div>
              )}

              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-semibold">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Enter your password"
                  required
                  minLength="6"
                />
                {!isLogin && (
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gold text-white py-3 rounded-lg hover:bg-gold/90 transition font-semibold mb-4"
              >
                {isLogin ? 'Login' : 'Create Account'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
                className="w-full text-gold hover:underline"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-gray-600 mb-4">Or continue as guest</p>
              <button
                onClick={() => router.push('/shop')}
                className="text-gold hover:underline font-semibold"
              >
                Continue Shopping →
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
