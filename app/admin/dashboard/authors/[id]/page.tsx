'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'

type Author = {
    id: string
    name: string
    slug: string
    bio: string | null
    photo_url: string | null
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

export default function EditAuthorPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState({
        name: '',
        slug: '',
        bio: '',
        photo_url: '',
    })

    useEffect(() => {
        async function load() {
            const res = await fetch('/api/authors')
            const authors = await res.json()
            const author = authors.find((a: Author) => a.id === id)
            if (author) {
                setForm({
                    name: author.name ?? '',
                    slug: author.slug ?? '',
                    bio: author.bio ?? '',
                    photo_url: author.photo_url ?? '',
                })
            }
            setLoading(false)
        }
        load()
    }, [id])

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

        const res = await fetch('/api/authors', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...form }),
        })

        if (res.ok) {
            router.push('/admin/dashboard/authors')
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
                <h1 className="text-2xl font-bold text-white">Edit Author</h1>
            </div>

            <div
                style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}
                className="rounded-xl p-6 space-y-4"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>

                <div>
                    <label style={labelStyle} className="text-xs font-medium block mb-1.5">Bio</label>
                    <textarea
                        value={form.bio}
                        onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                        rows={3}
                        style={inputStyle}
                        className={`${inputClass} resize-none`}
                    />
                </div>

                <div>
                    <label style={labelStyle} className="text-xs font-medium block mb-1.5">Photo</label>
                    <div className="flex items-center gap-4">
                        {form.photo_url && (
                            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                <Image src={form.photo_url} alt="Author" fill className="object-cover" />
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
                        {uploading && <span style={{ color: '#6b7280' }} className="text-xs">Uploading...</span>}
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{ backgroundColor: '#2563eb' }}
                        className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Update Author'}
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