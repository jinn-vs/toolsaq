'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Tool = { id: string; name: string; slug: string }

type Comparison = {
    id: string
    slug: string
    is_published: boolean | null
    published_at: string | null
    created_at: string | null
    tool_a: Tool | null
    tool_b: Tool | null
}

export default function ComparisonsAdminPage() {
    const [comparisons, setComparisons] = useState<Comparison[]>([])
    const [loading, setLoading] = useState(true)

    async function fetchComparisons() {
        const res = await fetch('/api/comparisons')
        const data = await res.json()
        setComparisons(data)
        setLoading(false)
    }

    useEffect(() => { fetchComparisons() }, [])

    async function handleDelete(id: string, slug: string) {
        if (!confirm('Delete this comparison?')) return
        await fetch('/api/comparisons', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, slug }),
        })
        await fetchComparisons()
    }

    async function handleTogglePublish(comp: Comparison) {
        await fetch('/api/comparisons', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: comp.id,
                is_published: !comp.is_published,
                published_at: !comp.is_published ? new Date().toISOString() : null,
            }),
        })
        await fetchComparisons()
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-white">Comparisons</h1>
                <Link
                    href="/admin/dashboard/comparisons/new"
                    style={{ backgroundColor: '#ea580c' }}
                    className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:bg-orange-700 transition-colors"
                >
                    + New Comparison
                </Link>
            </div>

            {loading ? (
                <p style={{ color: '#6b7280' }} className="text-sm">Loading...</p>
            ) : comparisons.length === 0 ? (
                <p style={{ color: '#6b7280' }} className="text-sm">No comparisons yet.</p>
            ) : (
                <div
                    style={{ border: '1px solid #1f2937', backgroundColor: '#111827' }}
                    className="rounded-xl overflow-hidden"
                >
                    {comparisons.map((comp, i) => (
                        <div
                            key={comp.id}
                            style={{
                                borderBottom: i < comparisons.length - 1 ? '1px solid #1f2937' : 'none',
                            }}
                            className="flex items-center justify-between px-5 py-4"
                        >
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-white font-medium text-sm">
                                        {comp.tool_a?.name ?? '?'} vs {comp.tool_b?.name ?? '?'}
                                    </p>
                                    <span
                                        style={{
                                            backgroundColor: comp.is_published ? '#14532d' : '#1f2937',
                                            color: comp.is_published ? '#86efac' : '#6b7280',
                                        }}
                                        className="text-xs px-2 py-0.5 rounded-full"
                                    >
                                        {comp.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <p style={{ color: '#6b7280' }} className="text-xs mt-0.5">
                                    /{comp.slug}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleTogglePublish(comp)}
                                    style={{
                                        border: `1px solid ${comp.is_published ? '#374151' : '#166534'}`,
                                        color: comp.is_published ? '#9ca3af' : '#86efac',
                                    }}
                                    className="px-3 py-1.5 rounded-lg text-xs hover:bg-gray-800 transition-colors"
                                >
                                    {comp.is_published ? 'Unpublish' : 'Publish'}
                                </button>
                                <Link
                                    href={`/admin/dashboard/comparisons/${comp.id}`}
                                    style={{ border: '1px solid #374151', color: '#9ca3af' }}
                                    className="px-3 py-1.5 rounded-lg text-xs hover:bg-gray-800 hover:text-white transition-colors"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(comp.id, comp.slug)}
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