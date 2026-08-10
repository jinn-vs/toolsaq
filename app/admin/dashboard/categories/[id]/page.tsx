'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

type Category = {
    id: string
    name: string
    slug: string
    description: string | null
}

export default function EditCategoryPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState({
        name: '',
        slug: '',
        description: '',
    })

    useEffect(() => {
        async function load() {
            const res = await fetch('/api/categories')
            const categories = await res.json()
            const category = categories.find((c: Category) => c.id === id)
            if (category) {
                setForm({
                    name: category.name ?? '',
                    slug: category.slug ?? '',
                    description: category.description ?? '',
                })
            }
            setLoading(false)
        }
        load()
    }, [id])

    async function handleSave() {
        if (!form.name || !form.slug) return
        setSaving(true)

        const res = await fetch('/api/categories', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...form }),
        })

        if (res.ok) {
            router.push('/admin/dashboard/categories')
        } else {
            setSaving(false)
        }
    }

    const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors"
    const inputStyle = { backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }
    const labelStyle = { color: '#9ca3af' }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p style={{ color: '#6b7280' }} className="text-sm">Loading...</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => router.back()} style={{ color: '#6b7280' }} className="text-sm hover:text-white">
                    ← Back
                </button>
                <h1 className="text-2xl font-bold text-white">Edit Category</h1>
            </div>

            <div
                style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}
                className="rounded-xl p-6 space-y-4"
            >
                <div>
                    <label style={labelStyle} className="text-xs font-medium block mb-1.5">Name *</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        style={inputStyle}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label style={labelStyle} className="text-xs font-medium block mb-1.5">Slug *</label>
                    <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                        style={inputStyle}
                        className={inputClass}
                    />
                </div>

                <div>
                    <label style={labelStyle} className="text-xs font-medium block mb-1.5">Description</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        rows={3}
                        style={inputStyle}
                        className={`${inputClass} resize-none`}
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{ backgroundColor: '#2563eb' }}
                        className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Update Category'}
                    </button>
                    <button
                        onClick={() => router.back()}
                        style={{ border: '1px solid #374151', color: '#9ca3af' }}
                        className="px-5 py-2.5 rounded-lg text-sm hover:bg-gray-800"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}