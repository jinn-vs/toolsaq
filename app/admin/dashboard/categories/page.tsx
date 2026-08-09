'use client'

import { useState, useEffect } from 'react'

type Category = {
    id: string
    name: string
    slug: string
    description: string | null
    created_at: string | null
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

export default function CategoriesAdminPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState({ name: '', slug: '', description: '' })
    const [showForm, setShowForm] = useState(false)

    async function fetchCategories() {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(data)
        setLoading(false)
    }

    useEffect(() => { fetchCategories() }, [])

    function resetForm() {
        setForm({ name: '', slug: '', description: '' })
        setEditingId(null)
        setShowForm(false)
    }

    function handleNameChange(name: string) {
        setForm((f) => ({ ...f, name, slug: editingId ? f.slug : slugify(name) }))
    }

    async function handleSave() {
        if (!form.name || !form.slug) return
        setSaving(true)

        if (editingId) {
            await fetch('/api/categories', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingId, ...form }),
            })
        } else {
            await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
        }

        await fetchCategories()
        resetForm()
        setSaving(false)
    }

    async function handleDelete(id: string, slug: string) {
        if (!confirm('Delete this category?')) return
        await fetch('/api/categories', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, slug }),
        })
        await fetchCategories()
    }

    function handleEdit(cat: Category) {
        setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? '' })
        setEditingId(cat.id)
        setShowForm(true)
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-white">Categories</h1>
                <button
                    onClick={() => { resetForm(); setShowForm(true) }}
                    style={{ backgroundColor: '#2563eb' }}
                    className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                    + New Category
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div
                    style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}
                    className="rounded-xl p-6 mb-8"
                >
                    <h2 className="text-white font-semibold mb-4">
                        {editingId ? 'Edit Category' : 'New Category'}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label style={{ color: '#9ca3af' }} className="text-xs font-medium block mb-1.5">
                                Name *
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="AI Tools"
                                style={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }}
                                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label style={{ color: '#9ca3af' }} className="text-xs font-medium block mb-1.5">
                                Slug *
                            </label>
                            <input
                                type="text"
                                value={form.slug}
                                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                                placeholder="ai-tools"
                                style={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }}
                                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label style={{ color: '#9ca3af' }} className="text-xs font-medium block mb-1.5">
                                Description
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                placeholder="AI-powered tools and applications"
                                rows={3}
                                style={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }}
                                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                style={{ backgroundColor: '#2563eb' }}
                                className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                            </button>
                            <button
                                onClick={resetForm}
                                style={{ border: '1px solid #374151', color: '#9ca3af' }}
                                className="px-5 py-2.5 rounded-lg text-sm hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            {loading ? (
                <p style={{ color: '#6b7280' }} className="text-sm">Loading...</p>
            ) : categories.length === 0 ? (
                <p style={{ color: '#6b7280' }} className="text-sm">No categories yet.</p>
            ) : (
                <div
                    style={{ border: '1px solid #1f2937', backgroundColor: '#111827' }}
                    className="rounded-xl overflow-hidden"
                >
                    {categories.map((cat, i) => (
                        <div
                            key={cat.id}
                            style={{
                                borderBottom: i < categories.length - 1 ? '1px solid #1f2937' : 'none',
                            }}
                            className="flex items-center justify-between px-5 py-4"
                        >
                            <div>
                                <p className="text-white font-medium text-sm">{cat.name}</p>
                                <p style={{ color: '#6b7280' }} className="text-xs mt-0.5">
                                    /{cat.slug}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(cat)}
                                    style={{ border: '1px solid #374151', color: '#9ca3af' }}
                                    className="px-3 py-1.5 rounded-lg text-xs hover:bg-gray-800 hover:text-white transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(cat.id, cat.slug)}
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