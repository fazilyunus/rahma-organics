'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('adminSidebarOpen')
    if (savedState !== null) {
      setSidebarOpen(savedState === 'true')
    }
  }, [])

  // Save sidebar state to localStorage when it changes
  const toggleSidebar = () => {
    const newState = !sidebarOpen
    setSidebarOpen(newState)
    localStorage.setItem('adminSidebarOpen', String(newState))
  }

  const menuItems = [
    {
      title: 'Dashboard',
      icon: '📊',
      path: '/admin/dashboard',
      description: 'Overview & Analytics'
    },
    {
      title: 'Products',
      icon: '🧴',
      path: '/admin/products',
      description: 'Manage Inventory'
    },
    {
      title: 'Orders',
      icon: '📦',
      path: '/admin/orders',
      description: 'Track Orders'
    },
    {
      title: 'Customers',
      icon: '👥',
      path: '/admin/customers',
      description: 'Customer Database'
    },
    {
      title: 'Settings',
      icon: '⚙️',
      path: '/admin/settings',
      description: 'Site Configuration'
    }
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } flex flex-col fixed h-screen z-40`}>
        {/* Logo & Toggle */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen ? (
            <div>
              <h1 className="text-xl font-serif text-gold">Rahma Organics</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          ) : (
            <div className="text-2xl">🌿</div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-700 rounded transition"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-4 px-4 py-3 mx-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gold text-white shadow-lg'
                    : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                {sidebarOpen && (
                  <div className="flex-1">
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-gray-700 p-4 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 rounded transition"
          >
            <span className="text-xl">🌐</span>
            {sidebarOpen && <span className="text-sm">View Website</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-600 rounded transition"
          >
            <span className="text-xl">🚪</span>
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {menuItems.find(item => item.path === pathname)?.title || 'Admin Panel'}
            </h2>
            <p className="text-sm text-gray-600">
              {menuItems.find(item => item.path === pathname)?.description || 'Manage your store'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-semibold">Admin</div>
              <div className="text-xs text-gray-600">Super Administrator</div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-gold to-amber-600 rounded-full flex items-center justify-center text-white text-xl">
              👑
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
