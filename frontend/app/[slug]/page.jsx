'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function DynamicPage() {
  const params = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      fetch(`http://localhost:5000/api/settings/pages/${params.slug}`)
        .then(res => {
          if (!res.ok) throw new Error('Page not found')
          return res.json()
        })
        .then(data => {
          setPage(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Failed to load page:', err)
          setLoading(false)
        })
    }
  }, [params.slug])

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

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 text-center py-20">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl text-gray-600">Page not found</p>
        </div>
        <Footer />
      </div>
    )
  }

  // Simple markdown-like rendering
  const renderContent = (content) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-4xl font-serif text-gold mb-6 mt-8">{line.substring(2)}</h1>
      } else if (line.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-semibold text-gold mb-4 mt-6">{line.substring(3)}</h2>
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold mb-2">{line.substring(2, line.length - 2)}</p>
      } else if (line.startsWith('- ')) {
        return <li key={i} className="ml-6 mb-2">{line.substring(2)}</li>
      } else if (line.trim() === '') {
        return <br key={i} />
      } else {
        return <p key={i} className="mb-4 text-gray-700 leading-relaxed">{line}</p>
      }
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            {renderContent(page.content)}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
