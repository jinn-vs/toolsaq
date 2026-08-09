'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type Category = {
    id: string
    name: string
    slug: string
}

type Tool = {
    id: string
    name: string
    slug: string
    tagline: string | null
    logo_url: string | null
    website: string | null
    is_featured: boolean | null
    category: Category | null
    created_at: string | null
}

export default function ToolsAdminPage() {
    const [tools, setTools] = useState<Tool[]>([])
    const [loading, setLoading] = useState(true)

    async function fetchTools() {
        const res = await fetch('/api/tools')
        const data = await res.json()
        setTools(data)
        setLoading(false)
    }

    useEffect(() => { fetchTools() }, [])

    async function handleDelete(id: string, slug: string) {
        if (!confirm('Delete this tool?')) return
        await fetch('/api/tools', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, slug }),
        })
        await fetchTools()
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-white">Tools</h1>
                <Link
                    href="/admin/dashboard/tools/new"
                    style={{ backgroundColor: '#2563eb' }}
                    className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                    + New Tool
                </Link>
            </div>

            {loading ? (
                <p style={{ color: '#6b7280' }} className="text-sm">Loading...</p>
            ) : tools.length === 0 ? (
                <p style={{ color: '#6b7280' }} className="text-sm">No tools yet.</p>
            ) : (
                <div
                    style={{ border: '1px solid #1f2937', backgroundColor: '#111827' }}
                    className="rounded-xl overflow-hidden"
                >
                    {tools.map((tool, i) => (
                        <div
                            key={tool.id}
                            style={{
                                borderBottom: i < tools.length - 1 ? '1px solid #1f2937' : 'none',
                            }}
                            className="flex items-center justify-between px-5 py-4"
                        >
                            <div className="flex items-center gap-3">
                                {tool.logo_url ? (
                                    <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                                        <Image
                                            src={tool.logo_url}
                                            alt={tool.name}
                                            fill
                                            className="object-contain p-1"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        style={{ backgroundColor: '#1f2937', color: '#6b7280' }}
                                        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                                    >
                                        {tool.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-white font-medium text-sm">{tool.name}</p>
                                        {tool.is_featured && (
                                            <span
                                                style={{ backgroundColor: '#1d4ed8', color: '#93c5fd' }}
                                                className="text-xs px-2 py-0.5 rounded-full"
                                            >
                                                Featured
                                            </span>
                                        )}
                                        {tool.category && (
                                            <span
                                                style={{ backgroundColor: '#1f2937', color: '#6b7280' }}
                                                className="text-xs px-2 py-0.5 rounded-full"
                                            >
                                                {tool.category.name}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ color: '#6b7280' }} className="text-xs mt-0.5">
                                        /{tool.slug}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/tools/${tool.slug}`}
                                    target="_blank"
                                    style={{ border: '1px solid #374151', color: '#9ca3af' }}
                                    className="px-3 py-1.5 rounded-lg text-xs hover:bg-gray-800 hover:text-white transition-colors"
                                >
                                    View
                                </Link>
                                <Link
                                    href={`/admin/dashboard/tools/${tool.id}`}
                                    style={{ border: '1px solid #374151', color: '#9ca3af' }}
                                    className="px-3 py-1.5 rounded-lg text-xs hover:bg-gray-800 hover:text-white transition-colors"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(tool.id, tool.slug)}
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