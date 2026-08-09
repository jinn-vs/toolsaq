'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

export default function EditComparisonPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [tools, setTools] = useState<Tool[]>([])
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState({
        tool_a_id: '',
        tool_b_id: '',
        slug: '',
        verdict: '',
        is_published: false,
    })

    useEffect(() => {
        async function load() {
            const [compsRes, toolsRes] = await Promise.all([
                fetch('/api/comparisons'),
                fetch('/api/tools'),
            ])
            const comps = await compsRes.json()
            const toolsList = await toolsRes.json()
            setTools(toolsList)

            const comp = comps.find((c: { id: string }) => c.id === id)
            if (comp) {
                setForm({
                    tool_a_id: comp.tool_a_id ?? '',
                    tool_b_id: comp.tool_b_id ?? '',
                    slug: comp.slug ?? '',
                    verdict: comp.verdict ?? '',
                    is_published: comp.is_published ?? false,
                })
            }
            setLoading(false)
        }
        load()
    }, [id])

    async function handleSave(publish?: boolean) {
        if (!form.tool_a_id || !form.tool_b_id || !form.slug) return
        setSaving(true)

        const isPublishing = publish !== undefined ? publish : form.is_published

        const payload = {
            id,
            ...form,
            is_published: isPublishing,
            published_at: isPublishing ? new Date().toISOString() : null,
        }

        const res = await fetch('/api/comparisons', {
            method: 'PUT',
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p style={{ color: '#6b7280' }} className="text-sm">Loading...</p>
            </div>
        )
    }

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
                <h1 className="text-2xl font-bold text-white">Edit Comparison</h1>
                {form.is_published && (
                    <span
                        style={{ backgroundColor: '#14532d', color: '#86efac' }}
                        className="text-xs px-2 py-1 rounded-full"
                    >
                        Published
                    </span>
                )}
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
                                onChange={(e) => setForm((f) => ({ ...f, tool_a_id: e.target.value }))}
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
                                onChange={(e) => setForm((f) => ({ ...f, tool_b_id: e.target.value }))}
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
                        onClick={() => handleSave()}
                        disabled={saving}
                        style={{ border: '1px solid #374151', color: '#9ca3af' }}
                        className="px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    {!form.is_published && (
                        <button
                            onClick={() => handleSave(true)}
                            disabled={saving}
                            style={{ backgroundColor: '#ea580c' }}
                            className="px-6 py-3 rounded-lg text-white text-sm font-semibold hover:bg-orange-700 disabled:opacity-50 transition-colors"
                        >
                            {saving ? 'Publishing...' : 'Publish'}
                        </button>
                    )}
                    {form.is_published && (
                        <button
                            onClick={() => handleSave(false)}
                            disabled={saving}
                            style={{ border: '1px solid #374151', color: '#fbbf24' }}
                            className="px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                            Unpublish
                        </button>
                    )}
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