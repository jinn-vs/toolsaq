'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), {
    ssr: false,
    loading: () => (
        <div
            style={{ border: '1px solid #374151', backgroundColor: '#111827', minHeight: '200px' }}
            className="rounded-lg flex items-center justify-center"
        >
            <p style={{ color: '#6b7280' }} className="text-sm">Loading editor...</p>
        </div>
    ),
})

type Tool = { id: string; name: string; slug: string }

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

export default function NewComparisonPage() {
    const router = useRouter()
    const [tools, setTools] = useState<Tool[]>([])
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        tool_a_id: '',
        tool_b_id: '',
        slug: '',
        verdict: '',
        is_published: false,
    })

    useEffect(() => {
        fetch('/api/tools').then((r) => r.json()).then(setTools)
    }, [])

    function handleToolChange(field: 'tool_a_id' | 'tool_b_id', value: string) {
        setForm((f) => {
            const updated = { ...f, [field]: value }
            const toolA = tools.find((t) => t.id === updated.tool_a_id)
            const toolB = tools.find((t) => t.id === updated.tool_b_id)
            if (toolA && toolB) {
                updated.slug = slugify(`${toolA.name}-vs-${toolB.name}`)
            }
            return updated
        })
    }

    async function handleSave(publish = false) {
        if (!form.tool_a_id || !form.tool_b_id || !form.slug) return
        setSaving(true)

        const payload = {
            ...form,
            is_published: publish,
            published_at: publish ? new Date().toISOString() : null,
        }

        const res = await fetch('/api/comparisons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })

        if (res.ok) {
            router.push('/admin/dashboard/comparisons')
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
                <h1 className="text-2xl font-bold text-white">New Comparison</h1>
            </div>

            <div className="space-y-6">
                {/* Tools */}
                <div
                    style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}
                    className="rounded-xl p-6"
                >
                    <h2 className="text-white font-semibold mb-4">Select Tools</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label style={labelStyle} className="text-xs font-medium block mb-1.5">
                                Tool A *
                            </label>
                            <select
                                value={form.tool_a_id}
                                onChange={(e) => handleToolChange('tool_a_id', e.target.value)}
                                style={inputStyle}
                                className={inputClass}
                            >
                                <option value="">Select tool</option>
                                {tools.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle} className="text-xs font-medium block mb-1.5">
                                Tool B *
                            </label>
                            <select
                                value={form.tool_b_id}
                                onChange={(e) => handleToolChange('tool_b_id', e.target.value)}
                                style={inputStyle}
                                className={inputClass}
                            >
                                <option value="">Select tool</option>
                                {tools.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label style={labelStyle} className="text-xs font-medium block mb-1.5">
                            Slug *
                        </label>
                        <input
                            type="text"
                            value={form.slug}
                            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                            placeholder="tool-a-vs-tool-b"
                            style={inputStyle}
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Verdict */}
                <div
                    style={{ backgroundColor: '#111827', border: '1px solid #1f2937' }}
                    className="rounded-xl p-6"
                >
                    <h2 className="text-white font-semibold mb-4">Verdict</h2>
                    <TiptapEditor
                        content={form.verdict}
                        onChange={(html) => setForm((f) => ({ ...f, verdict: html }))}
                        placeholder="Write your verdict comparing the two tools..."
                    />
                </div>

                {/* Save */}
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
                        style={{ backgroundColor: '#ea580c' }}
                        className="px-6 py-3 rounded-lg text-white text-sm font-semibold hover:bg-orange-700 disabled:opacity-50 transition-colors"
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