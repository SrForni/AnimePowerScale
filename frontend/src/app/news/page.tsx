'use client'

import { useEffect, useState } from 'react'
import { Newspaper, Tag, Clock } from 'lucide-react'

interface NewsItem {
  id: number
  title: string
  content: string
  category: 'announcement'
  date: string
  imageUrl?: string
  link: string
}

const categoryStyles = {
  announcement: {
    bg: 'bg-purple-400/10',
    text: 'text-purple-400',
    border: 'border-purple-400/20'
  }
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/noticias-anime')
        const data = await res.json()
        console.log("🧩 Noticias recibidas:", data)
        setNews(data.noticias || [])
      } catch (error) {
        console.error("❌ Error al obtener noticias:", error)
      }
    }

    fetchNews()
  }, [])

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-10 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-purple-400" />
            Noticias de Anime
          </h1>
        </div>

        {/* Grid de noticias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map(news => {
            const styles = categoryStyles[news.category]
            return (
              <article
                key={news.id}
                className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all group"
              >
                {/* Imagen */}
                <div className="aspect-video relative bg-gray-800 overflow-hidden">
                  {news.imageUrl ? (
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Newspaper className="h-12 w-12 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${styles.bg} ${styles.text} ${styles.border}`}>
                      {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      {news.date}
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold mb-3 group-hover:text-purple-400 transition-colors">
                    {news.title}
                  </h2>

                  <p className="text-gray-400 line-clamp-3">{news.content}</p>

                  <a
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-purple-400 hover:text-purple-300 text-sm font-medium inline-flex items-center gap-1"
                  >
                    Leer más
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
