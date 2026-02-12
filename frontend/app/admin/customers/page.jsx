'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    loadCustomers()
  }, [router])

  const loadCustomers = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setCustomers(data.filter(u => u.role === 'customer'))
    } catch (err) {
      console.error('Failed to load customers:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Registered Customers ({customers.length})</h2>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-600">Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-xl text-gray-600">No customers yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map(customer => (
              <div key={customer.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold to-amber-600 rounded-full flex items-center justify-center text-2xl text-white">
                    {customer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{customer.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{customer.email}</p>
                    {customer.phone && (
                      <p className="text-sm text-gray-600 mb-2">📞 {customer.phone}</p>
                    )}
                    <div className="text-xs text-gray-500">
                      Joined {customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'Recently'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
