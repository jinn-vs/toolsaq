'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

type Author = {
    id: string
    name: string
    slug: string
    bio: string | null
    photo_url: string | null
    created_at: string | null
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

export default function AuthorsAdminPage() {
    const [authors, setAuthors] = useState<Author[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState({ name: '', slug: '', bio: '', photo_url: '' })
    const [showForm, setShowForm] = useState(false)

    async function fetchAuthors() {
        const res = await fetch('/api/authors')
        const data = await res.json()
        setAuthors(data)
        setLoading(false)
    }

    useEffect(() => { fetchAuthors() }, [])

    function resetForm() {
        setForm({ name: '', slug: '', bio: '', photo_url: '' })
        setEditingId(null)
        setShowForm(false)
    }

    function handleNameChange(name: string) {
        setForm((f) => ({ ...f, name, slug: editingId ? f.slug : slugify(name) }))
    }

    async function handlePhotoUpload(file: File) {
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            const { url } = await res.json()
            if (url) setForm((f) => ({ ...f, photo_url: url }))
        } catch (err) {
            console.error('Upload failed:', err)
        } finally {
            setUploading(false)
        }
    }

    async function handleSave() {
        if (!form.name || !form.slug) return
        setSaving(true)

        if (editingId) {
            await fetch('/api/authors', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingId, ...form }),
            })
        } else {
            await fetch('/api/authors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
        }

        await fetchAuthors()
        resetForm()
        setSaving(false)
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this author?')) return
        await fetch('/api/authors', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        await fetchAuthors()
    }

    function handleEdit(author: Author) {
        setForm({
            name: author.name,
            slug: author.slug,
            bio: author.bio ?? '',
            photo_url: author.photo_url ?? '',
        })
        setEditingId(author.id)
        setShowForm(true)
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-white">Authors</h1>
                <button
                    onClick={() => { resetForm(); setShowForm(true) }}
                    style={{ backgroundColor: '#2563eb' }}
                    className="px-4 py-2 rounded-lg text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                    + New Author
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div
                    style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}
                    className="rounded-xl p-6 mb-8"
                >
                    <h2 className="text-white font-semibold mb-4">
                        {editingId ? 'Edit Author' : 'New Author'}
                    </h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label style={{ color: '#9ca3af' }} className="text-xs font-medium block mb-1.5">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="John Doe"
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
                                    placeholder="john-doe"
                                    style={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }}
                                    className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ color: '#9ca3af' }} className="text-xs font-medium block mb-1.5">
                                Bio
                            </label>
                            <textarea
                                value={form.bio}
                                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                                placeholder="Software engineer and AI enthusiast..."
                                rows={3}
                                style={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }}
                                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"
                            />
                        </div>

                        <div>
                            <label style={{ color: '#9ca3af' }} className="text-xs font-medium block mb-1.5">
                                Photo
                            </label>
                            <div className="flex items-center gap-4">
                                {form.photo_url && (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={form.photo_url}
                                            alt="Author photo"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) handlePhotoUpload(file)
                                    }}
                                    style={{ color: '#9ca3af' }}
                                    className="text-sm"
                                />
                                {uploading && (
                                    <span style={{ color: '#6b7280' }} className="text-xs">
                                        Uploading...
                                    </span>
                                )}
                            </div>
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
            ) : authors.length === 0 ? (
                <p style={{ color: '#6b7280' }} className="text-sm">No authors yet.</p>
            ) : (
                <div
                    style={{ border: '1px solid #1f2937', backgroundColor: '#111827' }}
                    className="rounded-xl overflow-hidden"
                >
                    {authors.map((author, i) => (
                        <div
                            key={author.id}
                            style={{
                                borderBottom: i < authors.length - 1 ? '1px solid #1f2937' : 'none',
                            }}
                            className="flex items-center justify-between px-5 py-4"
                        >
                            <div className="flex items-center gap-3">
                                {author.photo_url ? (
                                    <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={author.photo_url}
                                            alt={author.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        style={{ backgroundColor: '#1f2937', color: '#6b7280' }}
                                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                                    >
                                        {author.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="text-white font-medium text-sm">{author.name}</p>
                                    <p style={{ color: '#6b7280' }} className="text-xs mt-0.5">
                                        /{author.slug}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(author)}
                                    style={{ border: '1px solid #374151', color: '#9ca3af' }}
                                    className="px-3 py-1.5 rounded-lg text-xs hover:bg-gray-800 hover:text-white transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(author.id)}
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