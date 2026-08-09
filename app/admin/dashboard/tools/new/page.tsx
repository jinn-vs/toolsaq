'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Category = {
    id: string
    name: string
    slug: string
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

export default function NewToolPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [form, setForm] = useState({
        name: '',
        slug: '',
        tagline: '',
        description: '',
        website: '',
        category_id: '',
        logo_url: '',
        is_featured: false,
        pros: [''],
        cons: [''],
        faqs: [{ question: '', answer: '' }],
    })

    useEffect(() => {
        fetch('/api/categories').then((r) => r.json()).then(setCategories)
    }, [])

    function handleNameChange(name: string) {
        setForm((f) => ({ ...f, name, slug: slugify(name) }))
    }

    async function handleLogoUpload(file: File) {
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            const { url } = await res.json()
            if (url) setForm((f) => ({ ...f, logo_url: url }))
        } catch (err) {
            console.error('Upload failed:', err)
        } finally {
            setUploading(false)
        }
    }

    function updatePro(index: number, value: string) {
        const pros = [...form.pros]
        pros[index] = value
        setForm((f) => ({ ...f, pros }))
    }

    function updateCon(index: number, value: string) {
        const cons = [...form.cons]
        cons[index] = value
        setForm((f) => ({ ...f, cons }))
    }

    function updateFaq(index: number, field: 'question' | 'answer', value: string) {
        const faqs = [...form.faqs]
        faqs[index] = { ...faqs[index], [field]: value }
        setForm((f) => ({ ...f, faqs }))
    }

    async function handleSave() {
        if (!form.name || !form.slug) return
        setSaving(true)

        const payload = {
            ...form,
            pros: form.pros.filter(Boolean),
            cons: form.cons.filter(Boolean),
            faqs: form.faqs.filter((f) => f.question && f.answer),
            category_id: form.category_id || null,
        }

        const res = await fetch('/api/tools', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })

        if (res.ok) {
            router.push('/admin/dashboard/tools')
        } else {
            console.error('Save failed')
            setSaving(false)
        }
    }

    const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors"
    const inputStyle = { backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }
    const labelStyle = { color: '#9ca3af' }

    return (
        <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    style={{ color: '#6b7280' }}
                    className="text-sm hover:text-white transition-colors"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-bold text-white">New Tool</h1>
            </div>

            <div className="space-y-6">
                {/* Basic Info */}
                <div
                    style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}
                    className="rounded-xl p-6"
                >
                    <h2 className="text-white font-semibold mb-4">Basic Info</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label style={labelStyle} className="text-xs font-medium block mb-1.5">Name *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="Cursor"
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
                                    placeholder="cursor"
                                    style={inputStyle}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle} className="text-xs font-medium block mb-1.5">Tagline</label>
                            <input
                                type="text"
                                value={form.tagline}
                                onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                                placeholder="AI-powered code editor"
                                style={inputStyle}
                                className={inputClass}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label style={labelStyle} className="text-xs font-medium block mb-1.5">Website URL</label>
                                <input
                                    type="url"
                                    value={form.website}
                                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                                    placeholder="https://cursor.sh"
                                    style={inputStyle}
                                    className={inputClass}
                                />
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

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={form.is_featured}
                                onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                                className="w-4 h-4"
                            />
                            <label htmlFor="featured" style={{ color: '#9ca3af' }} className="text-sm">
                                Featured tool (show on homepage)
                            </label>
                        </div>
                    </div>
                </div>

                {/* Logo */}
                <div
                    style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}
                    className="rounded-xl p-6"
                >
                    <h2 className="text-white font-semibold mb-4">Logo</h2>
                    <div className="flex items-center gap-4">
                        {form.logo_url ? (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                                <Image src={form.logo_url} alt="Logo" fill className="object-contain p-1" />
                            </div>
                        ) : (
                            <div
                                style={{ backgroundColor: '#1f2937', border: '2px dashed #374151' }}
                                className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                            >
                                <span style={{ color: '#6b7280' }} className="text-2xl">🖼</span>
                            </div>
                        )}
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleLogoUpload(file)
                                }}
                                style={{ color: '#9ca3af' }}
                                className="text-sm"
                            />
                            {uploading && <p style={{ color: '#6b7280' }} className="text-xs mt-1">Uploading...</p>}
                        </div>
                    </div>
                </div>

                {/* Pros */}
                <div
                    style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}
                    className="rounded-xl p-6"
                >
                    <h2 className="text-white font-semibold mb-4">Pros</h2>
                    <div className="space-y-2">
                        {form.pros.map((pro, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    type="text"
                                    value={pro}
                                    onChange={(e) => updatePro(i, e.target.value)}
                                    placeholder={`Pro ${i + 1}`}
                                    style={inputStyle}
                                    className={inputClass}
                                />
                                {form.pros.length > 1 && (
                                    <button
                                        onClick={() => setForm((f) => ({ ...f, pros: f.pros.filter((_, j) => j !== i) }))}
                                        style={{ color: '#f87171' }}
                                        className="text-sm px-2"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={() => setForm((f) => ({ ...f, pros: [...f.pros, ''] }))}
                            style={{ color: '#2563eb' }}
                            className="text-sm hover:underline"
                        >
                            + Add Pro
                        </button>
                    </div>
                </div>

                {/* Cons */}
                <div
                    style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}
                    className="rounded-xl p-6"
                >
                    <h2 className="text-white font-semibold mb-4">Cons</h2>
                    <div className="space-y-2">
                        {form.cons.map((con, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    type="text"
                                    value={con}
                                    onChange={(e) => updateCon(i, e.target.value)}
                                    placeholder={`Con ${i + 1}`}
                                    style={inputStyle}
                                    className={inputClass}
                                />
                                {form.cons.length > 1 && (
                                    <button
                                        onClick={() => setForm((f) => ({ ...f, cons: f.cons.filter((_, j) => j !== i) }))}
                                        style={{ color: '#f87171' }}
                                        className="text-sm px-2"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={() => setForm((f) => ({ ...f, cons: [...f.cons, ''] }))}
                            style={{ color: '#2563eb' }}
                            className="text-sm hover:underline"
                        >
                            + Add Con
                        </button>
                    </div>
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

                {/* Save */}
                <div className="flex gap-3 pb-8">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{ backgroundColor: '#2563eb' }}
                        className="px-6 py-3 rounded-lg text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {saving ? 'Saving...' : 'Create Tool'}
                    </button>
                    <button
                        onClick={() => router.back()}
                        style={{ border: '1px solid #374151', color: '#9ca3af' }}
                        className="px-6 py-3 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}