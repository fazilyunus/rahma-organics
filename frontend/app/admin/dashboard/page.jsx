'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: [],
    products: [],
    customers: []
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    loadDashboardData()
  }, [router])

  const loadDashboardData = async () => {
    const token = localStorage.getItem('token')
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        fetch('http://localhost:5000/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/products'),
        fetch('http://localhost:5000/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      const orders = await ordersRes.json()
      const products = await productsRes.json()
      const users = await usersRes.json()

      setStats({
        orders,
        products,
        customers: users.filter(u => u.role === 'customer')
      })
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getTotalRevenue = () => {
    return stats.orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + parseFloat(o.total), 0)
  }

  const getPendingOrders = () => {
    return stats.orders.filter(o => o.status === 'pending').length
  }

  const getLowStockProducts = () => {
    return stats.products.filter(p => p.stock < 10).length
  }

  const getRecentOrders = () => {
    return stats.orders
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Link href="/admin/orders">
                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer border-l-4 border-green-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">💰</div>
                    <div className="text-green-500 text-sm font-semibold">Revenue</div>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    KSh {getTotalRevenue().toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
              </Link>

              <Link href="/admin/orders">
                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">📦</div>
                    {getPendingOrders() > 0 && (
                      <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {getPendingOrders()} pending
                      </div>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stats.orders.length}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
              </Link>

              <Link href="/admin/products">
                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer border-l-4 border-purple-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">🧴</div>
                    {getLowStockProducts() > 0 && (
                      <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        {getLowStockProducts()} low stock
                      </div>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stats.products.length}</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
              </Link>

              <Link href="/admin/customers">
                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer border-l-4 border-gold">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">👥</div>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stats.customers.length}</div>
                  <div className="text-sm text-gray-600">Customers</div>
                </div>
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Link href="/admin/products">
                <div className="bg-gradient-to-br from-gold to-amber-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer transform hover:scale-105">
                  <div className="text-4xl mb-3">➕</div>
                  <h3 className="text-xl font-semibold mb-2">Add Product</h3>
                  <p className="text-sm opacity-90">Upload new products to your store</p>
                </div>
              </Link>

              <Link href="/admin/orders">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer transform hover:scale-105">
                  <div className="text-4xl mb-3">📋</div>
                  <h3 className="text-xl font-semibold mb-2">Manage Orders</h3>
                  <p className="text-sm opacity-90">Process and track customer orders</p>
                </div>
              </Link>

              <Link href="/admin/settings">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer transform hover:scale-105">
                  <div className="text-4xl mb-3">⚙️</div>
                  <h3 className="text-xl font-semibold mb-2">Site Settings</h3>
                  <p className="text-sm opacity-90">Configure your website</p>
                </div>
              </Link>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Recent Orders</h2>
                <Link href="/admin/orders" className="text-gold hover:underline font-semibold">
                  View All →
                </Link>
              </div>

              {getRecentOrders().length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No orders yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getRecentOrders().map(order => (
                        <tr key={order.id} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold">#{order.id}</td>
                          <td className="px-4 py-3">
                            {order.user_id ? `Customer #${order.user_id}` : 'Guest'}
                          </td>
                          <td className="px-4 py-3 font-bold text-gold">KSh {order.total}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
