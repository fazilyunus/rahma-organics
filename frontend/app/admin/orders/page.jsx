'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    loadOrders()
  }, [router])

  const loadOrders = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setOrders(data)
    } catch (err) {
      console.error('Failed to load orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (res.ok) {
        loadOrders()
        alert('Order status updated!')
      }
    } catch (err) {
      alert('Failed to update order status')
    }
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter)

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTotalRevenue = () => {
    return orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + parseFloat(o.total), 0)
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-2xl font-bold">{orders.length}</div>
            <div className="text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'completed').length}</div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold">KSh {getTotalRevenue().toLocaleString()}</div>
            <div className="text-gray-600">Revenue</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex gap-2">
            {['all', 'pending', 'processing', 'completed', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded capitalize ${
                  filter === status 
                    ? 'bg-gold text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600">No {filter !== 'all' ? filter : ''} orders found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">#{order.id}</td>
                    <td className="px-6 py-4">
                      {order.user_id ? `Customer #${order.user_id}` : 'Guest'}
                    </td>
                    <td className="px-6 py-4 font-bold text-gold">KSh {order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="px-3 py-1 border rounded text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
