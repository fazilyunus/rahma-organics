'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    is_featured: false
  })
  const [imagePreview, setImagePreview] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    loadProducts()
  }, [router])

  const loadProducts = () => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to load products:', err))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB. Please choose a smaller image.')
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, GIF)')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData({...formData, image: reader.result})
      }
      reader.onerror = () => {
        alert('Failed to read image file')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const url = editingProduct 
      ? `http://localhost:5000/api/admin/products/${editingProduct.id}`
      : 'http://localhost:5000/api/admin/products'
    
    const method = editingProduct ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setShowForm(false)
        setEditingProduct(null)
        setFormData({ name: '', description: '', price: '', stock: '', category: '', image: '', is_featured: false })
        setImagePreview('')
        loadProducts()
        alert(editingProduct ? 'Product updated! ✅' : 'Product added! ✅')
      } else {
        const error = await res.json()
        alert(`Failed to save product: ${error.message || 'Unknown error'}`)
      }
    } catch (err) {
      console.error('Save error:', err)
      alert('Failed to save product. Please check your connection and try again.')
    }
  }

  const editProduct = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock || 0,
      category: product.category || '',
      image: product.image || '',
      is_featured: product.is_featured || false
    })
    setImagePreview(product.image || '')
    setShowForm(true)
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return

    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (res.ok) {
      loadProducts()
      alert('Product deleted!')
    }
  }

  const cancelEdit = () => {
    setShowForm(false)
    setEditingProduct(null)
    setFormData({ name: '', description: '', price: '', stock: '', category: '', image: '', is_featured: false })
    setImagePreview('')
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Products ({products.length})</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition"
          >
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-2xl font-semibold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Hair Care">Hair Care</option>
                      <option value="Skin Care">Skin Care</option>
                      <option value="Body Care">Body Care</option>
                      <option value="Lip Care">Lip Care</option>
                      <option value="Face Care">Face Care</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Price (KSh) *</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                        required
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Stock *</label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                      rows="4"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <label htmlFor="featured" className="text-sm font-semibold">
                      Featured Product (show on homepage)
                    </label>
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-64 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('')
                            setFormData({...formData, image: ''})
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📷</div>
                        <p className="text-gray-600 mb-4">Upload product image</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="imageUpload"
                        />
                        <label
                          htmlFor="imageUpload"
                          className="cursor-pointer px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 inline-block"
                        >
                          Choose Image
                        </label>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: Square image, at least 500x500px
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="relative h-48 bg-gradient-to-br from-amber-100 to-amber-50">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-6xl">🧴</span>
                  </div>
                )}
                {product.is_featured && (
                  <span className="absolute top-2 right-2 bg-gold text-white px-2 py-1 rounded text-xs">
                    ⭐ Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-gold">KSh {product.price}</span>
                  <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editProduct(product)}
                    className="flex-1 px-4 py-2 bg-gold text-white rounded hover:bg-gold/90 transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded hover:border-red-400 hover:text-red-600 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !showForm && (
          <div className="text-center py-20 bg-white rounded-lg">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-xl text-gray-600 mb-4">No products yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90"
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
