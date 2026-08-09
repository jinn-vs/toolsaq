'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Article = {
    id: string
    title: string
    slug: string
    section: string | null
    is_published: boolean | null
    published_at: string | null
    created_at: string | null
    author: { id: string; name: string } | null
    category: { id: string; name: string; slug: string } | null
}

export default function ArticlesAdminPage() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)

    async function fetchArticles() {
        const res = await fetch('/api/articles')
        const data = await res.json()
        setArticles(data)
        setLoading(false)
    }

    useEffect(() => { fetchArticles() }, [])

    async function handleDelete(id: string, slug: string) {
        if (!confirm('Delete this article?')) return
        await fetch('/api/articles', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, slug }),
        })
        await fetchArticles()
    }

    async function handleTogglePublish(article: Article) {
        await fetch('/api/articles', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: article.id,
                is_published: !article.is_published,
                published_at: !article.is_published ? new Date().toISOString() : null,
            }),
        })
        await fetchArticles()
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-white">Articles</h1>
                <Link
                    href="/admin/dashboard/articles/new"
                    style={{ backgroundColor: '#16a34a' }}
                    className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:bg-green-700 transition-colors"
                >
                    + New Article
                </Link>
            </div>

            {loading ? (
                <p style={{ color: '#6b7280' }} className="text-sm">Loading...</p>
            ) : articles.length === 0 ? (
                <p style={{ color: '#6b7280' }} className="text-sm">No articles yet.</p>
            ) : (
                <div
                    style={{ border: '1px solid #1f2937', backgroundColor: '#111827' }}
                    className="rounded-xl overflow-hidden"
                >
                    {articles.map((article, i) => (
                        <div
                            key={article.id}
                            style={{
                                borderBottom: i < articles.length - 1 ? '1px solid #1f2937' : 'none',
                            }}
                            className="flex items-center justify-between px-5 py-4"
                        >
                            <div className="flex-1 min-w-0 mr-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-white font-medium text-sm truncate">
                                        {article.title}
                                    </p>
                                    <span
                                        style={{
                                            backgroundColor: article.is_published ? '#14532d' : '#1f2937',
                                            color: article.is_published ? '#86efac' : '#6b7280',
                                        }}
                                        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                                    >
                                        {article.is_published ? 'Published' : 'Draft'}
                                    </span>
                                    {article.section && (
                                        <span
                                            style={{ backgroundColor: '#1e3a5f', color: '#93c5fd' }}
                                            className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                                        >
                                            {article.section}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 mt-0.5">
                                    <p style={{ color: '#6b7280' }} className="text-xs">
                                        /{article.slug}
                                    </p>
                                    {article.author && (
                                        <p style={{ color: '#6b7280' }} className="text-xs">
                                            By {article.author.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <button
                                    onClick={() => handleTogglePublish(article)}
                                    style={{
                                        border: `1px solid ${article.is_published ? '#374151' : '#166534'}`,
                                        color: article.is_published ? '#9ca3af' : '#86efac',
                                    }}
                                    className="px-3 py-1.5 rounded-lg text-xs hover:bg-gray-800 transition-colors"
                                >
                                    {article.is_published ? 'Unpublish' : 'Publish'}
                                </button>
                                {article.is_published && (
                                    <Link
                                        href={`/blog/${article.slug}`}
                                        target="_blank"
                                        style={{ border: '1px solid #374151', color: '#9ca3af' }}
                                        className="px-3 py-1.5 rounded-lg text-xs hover:bg-gray-800 hover:text-white transition-colors"
                                    >
                                        View
                                    </Link>
                                )}
                                <Link
                                    href={`/admin/dashboard/articles/${article.id}`}
                                    style={{ border: '1px solid #374151', color: '#9ca3af' }}
                                    className="px-3 py-1.5 rounded-lg text-xs hover:bg-gray-800 hover:text-white transition-colors"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(article.id, article.slug)}
                                    style={{ border: '1px solid #7f1d1d', color: '#f87171' }}
                                    className="px-3 py-1.5 rounded-lg text-xs hover:bg-red-950 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}