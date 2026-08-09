'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Image from 'next/image'

const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), {
    ssr: false,
    loading: () => (
        <div
            style={{ border: '1px solid #374151', backgroundColor: '#111827', minHeight: '400px' }}
            className="rounded-lg flex items-center justify-center"
        >
            <p style={{ color: '#6b7280' }} className="text-sm">Loading editor...</p>
        </div>
    ),
})

type Category = { id: string; name: string; slug: string }
type Author = { id: string; name: string; slug: string }

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

export default function NewArticlePage() {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [authors, setAuthors] = useState<Author[]>([])
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [form, setForm] = useState({
        title: '',
        slug: '',
        excerpt: '',
        body: '',
        section: '',
        author_id: '',
        category_id: '',
        featured_image_url: '',
        is_published: false,
        faqs: [{ question: '', answer: '' }],
    })

    useEffect(() => {
        Promise.all([
            fetch('/api/categories').then((r) => r.json()),
            fetch('/api/authors').then((r) => r.json()),
        ]).then(([cats, auths]) => {
            setCategories(cats)
            setAuthors(auths)
        })
    }, [])

    function handleTitleChange(title: string) {
        setForm((f) => ({ ...f, title, slug: slugify(title) }))
    }

    async function handleImageUpload(file: File) {
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            const { url } = await res.json()
            if (url) setForm((f) => ({ ...f, featured_image_url: url }))
        } catch (err) {
            console.error('Upload failed:', err)
        } finally {
            setUploading(false)
        }
    }

    function updateFaq(index: number, field: 'question' | 'answer', value: string) {
        const faqs = [...form.faqs]
        faqs[index] = { ...faqs[index], [field]: value }
        setForm((f) => ({ ...f, faqs }))
    }

    async function handleSave(publish = false) {
        if (!form.title || !form.slug) return
        setSaving(true)

        const payload = {
            ...form,
            is_published: publish,
            published_at: publish ? new Date().toISOString() : null,
            faqs: form.faqs.filter((f) => f.question && f.answer),
            author_id: form.author_id || null,
            category_id: form.category_id || null,
        }

        const res = await fetch('/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })

        if (res.ok) {
            router.push('/admin/dashboard/articles')
        } else {
            console.error('Save failed')
            setSaving(false)
        }
    }

    const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors"
    const inputStyle = { backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }
    const labelStyle = { color: '#9ca3af' }

    return (
        <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    style={{ color: '#6b7280' }}
                    className="text-sm hover:text-white transition-colors"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-bold text-white">New Article</h1>
            </div>

            <div className="space-y-6">
                {/* Basic Info */}
                <div
                    style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}
                    className="rounded-xl p-6"
                >
                    <h2 className="text-white font-semibold mb-4">Basic Info</h2>
                    <div className="space-y-4">
                        <div>
                            <label style={labelStyle} className="text-xs font-medium block mb-1.5">Title *</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="Best AI Coding Tools in 2026"
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
                                placeholder="best-ai-coding-tools-2026"
                                style={inputStyle}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label style={labelStyle} className="text-xs font-medium block mb-1.5">
                                Excerpt (SEO description)
                            </label>
                            <textarea
                                value={form.excerpt}
                                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                                placeholder="A short summary of the article for search engines..."
                                rows={2}
                                style={inputStyle}
                                className={`${inputClass} resize-none`}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label style={labelStyle} className="text-xs font-medium block mb-1.5">Section</label>
                                <select
                                    value={form.section}
                                    onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
                                    style={inputStyle}
                                    className={inputClass}
                                >
                                    <option value="">Select section</option>
                                    <option value="Guides & Tutorials">Guides & Tutorials</option>
                                    <option value="Software Reviews">Software Reviews</option>
                                    <option value="Alternatives">Alternatives</option>
                                    <option value="Comparisons">Comparisons</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle} className="text-xs font-medium block mb-1.5">Author</label>
                                <select
                                    value={form.author_id}
                                    onChange={(e) => setForm((f) => ({ ...f, author_id: e.target.value }))}
                                    style={inputStyle}
                                    className={inputClass}
                                >
                                    <option value="">Select author</option>
                                    {authors.map((a) => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle} className="text-xs font-medium block mb-1.5">Category</label>
                                <select
                                    value={form.category_id}
                                    onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                                    style={inputStyle}
                                    className={inputClass}
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                <div
                    style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}
                    className="rounded-xl p-6"
                >
                    <h2 className="text-white font-semibold mb-4">Featured Image</h2>
                    <div className="space-y-3">
                        {form.featured_image_url && (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                <Image
                                    src={form.featured_image_url}
                                    alt="Featured"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleImageUpload(file)
                                }}
                                style={{ color: '#9ca3af' }}
                                className="text-sm"
                            />
                            {uploading && (
                                <span style={{ color: '#6b7280' }} className="text-xs">Uploading...</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Body — Tiptap */}
                <div
                    style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}
                    className="rounded-xl p-6"
                >
                    <h2 className="text-white font-semibold mb-4">Content</h2>
                    <TiptapEditor
                        content={form.body}
                        onChange={(html) => setForm((f) => ({ ...f, body: html }))}
                        placeholder="Start writing your article..."
                    />
                </div>

                {/* FAQs */}
                <div
                    style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}
                    className="rounded-xl p-6"
                >
                    <h2 className="text-white font-semibold mb-4">FAQs</h2>
                    <div className="space-y-4">
                        {form.faqs.map((faq, i) => (
                            <div
                                key={i}
                                style={{ border: '1px solid #1f2937' }}
                                className="rounded-lg p-4 space-y-2"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p style={{ color: '#6b7280' }} className="text-xs font-medium">FAQ {i + 1}</p>
                                    {form.faqs.length > 1 && (
                                        <button
                                            onClick={() => setForm((f) => ({ ...f, faqs: f.faqs.filter((_, j) => j !== i) }))}
                                            style={{ color: '#f87171' }}
                                            className="text-xs"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={faq.question}
                                    onChange={(e) => updateFaq(i, 'question', e.target.value)}
                                    placeholder="Question"
                                    style={inputStyle}
                                    className={inputClass}
                                />
                                <textarea
                                    value={faq.answer}
                                    onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                                    placeholder="Answer"
                                    rows={2}
                                    style={inputStyle}
                                    className={`${inputClass} resize-none`}
                                />
                            </div>
                        ))}
                        <button
                            onClick={() => setForm((f) => ({ ...f, faqs: [...f.faqs, { question: '', answer: '' }] }))}
                            style={{ color: '#2563eb' }}
                            className="text-sm hover:underline"
                        >
                            + Add FAQ
                        </button>
                    </div>
                </div>

                {/* Save buttons */}
                <div className="flex gap-3 pb-8">
                    <button
                        onClick={() => handleSave(false)}
                        disabled={saving}
                        style={{ border: '1px solid #374151', color: '#9ca3af' }}
                        className="px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                        {saving ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        disabled={saving}
                        style={{ backgroundColor: '#16a34a' }}
                        className="px-6 py-3 rounded-lg text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                        {saving ? 'Publishing...' : 'Publish'}
                    </button>
                    <button
                        onClick={() => router.back()}
                        style={{ color: '#6b7280' }}
                        className="px-6 py-3 rounded-lg text-sm hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}