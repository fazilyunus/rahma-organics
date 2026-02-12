'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'

export default function AdminSettings() {
  const [settings, setSettings] = useState({})
  const [pages, setPages] = useState([])
  const [activeTab, setActiveTab] = useState('general')
  const [editingPage, setEditingPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      const [settingsRes, pagesRes] = await Promise.all([
        fetch('http://localhost:5000/api/settings'),
        fetch('http://localhost:5000/api/settings/pages')
      ])
      
      const settingsData = await settingsRes.json()
      const pagesData = await pagesRes.json()
      
      setSettings(settingsData)
      setPages(pagesData)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSettingsSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    try {
      const res = await fetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      })

      if (res.ok) {
        alert('Settings saved successfully! ✅')
      } else {
        alert('Failed to save settings')
      }
    } catch (err) {
      alert('Error saving settings')
    }
  }

  const handlePageSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    try {
      const res = await fetch(`http://localhost:5000/api/settings/pages/${editingPage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingPage)
      })

      if (res.ok) {
        alert('Page updated successfully! ✅')
        setEditingPage(null)
        loadData()
      } else {
        alert('Failed to update page')
      }
    } catch (err) {
      alert('Error updating page')
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-4 font-semibold ${
                activeTab === 'general' 
                  ? 'border-b-2 border-gold text-gold' 
                  : 'text-gray-600 hover:text-gold'
              }`}
            >
              General Settings
            </button>
            <button
              onClick={() => setActiveTab('pages')}
              className={`px-6 py-4 font-semibold ${
                activeTab === 'pages' 
                  ? 'border-b-2 border-gold text-gold' 
                  : 'text-gray-600 hover:text-gold'
              }`}
            >
              Pages & Content
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-600">Loading...</p>
          </div>
        ) : activeTab === 'general' ? (
          /* General Settings */
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-6">General Settings</h2>
            <form onSubmit={handleSettingsSubmit}>
              <div className="space-y-6">
                {/* Business Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gold">Business Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Site Name</label>
                      <input
                        type="text"
                        value={settings.site_name || ''}
                        onChange={(e) => setSettings({...settings, site_name: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Tagline</label>
                      <input
                        type="text"
                        value={settings.site_tagline || ''}
                        onChange={(e) => setSettings({...settings, site_tagline: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gold">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        value={settings.contact_email || ''}
                        onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone</label>
                      <input
                        type="text"
                        value={settings.contact_phone || ''}
                        onChange={(e) => setSettings({...settings, contact_phone: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Address</label>
                      <input
                        type="text"
                        value={settings.contact_address || ''}
                        onChange={(e) => setSettings({...settings, contact_address: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Business Hours</label>
                      <input
                        type="text"
                        value={settings.business_hours || ''}
                        onChange={(e) => setSettings({...settings, business_hours: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gold">Social Media Links</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">📘 Facebook URL</label>
                      <input
                        type="url"
                        value={settings.facebook_url || ''}
                        onChange={(e) => setSettings({...settings, facebook_url: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">📷 Instagram URL</label>
                      <input
                        type="url"
                        value={settings.instagram_url || ''}
                        onChange={(e) => setSettings({...settings, instagram_url: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="https://instagram.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">🐦 Twitter URL</label>
                      <input
                        type="url"
                        value={settings.twitter_url || ''}
                        onChange={(e) => setSettings({...settings, twitter_url: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="https://twitter.com/yourpage"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">💬 WhatsApp Number</label>
                      <input
                        type="text"
                        value={settings.whatsapp_number || ''}
                        onChange={(e) => setSettings({...settings, whatsapp_number: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="+254700000000"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Pages Management */
          <div>
            {editingPage ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Edit Page: {editingPage.title}</h2>
                  <button
                    onClick={() => setEditingPage(null)}
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                  >
                    Back to Pages
                  </button>
                </div>
                <form onSubmit={handlePageSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Page Title</label>
                      <input
                        type="text"
                        value={editingPage.title}
                        onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Content (Markdown supported)</label>
                      <textarea
                        value={editingPage.content}
                        onChange={(e) => setEditingPage({...editingPage, content: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
                        rows="20"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="published"
                        checked={editingPage.published}
                        onChange={(e) => setEditingPage({...editingPage, published: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <label htmlFor="published" className="text-sm font-semibold">
                        Published (visible to customers)
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition"
                    >
                      Update Page
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {pages.map(page => (
                  <div key={page.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{page.title}</h3>
                        <p className="text-sm text-gray-600">/{page.slug}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        page.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {page.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <button
                      onClick={() => setEditingPage(page)}
                      className="w-full px-4 py-2 bg-gold text-white rounded hover:bg-gold/90 transition"
                    >
                      Edit Page
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
