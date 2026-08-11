'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { useCallback, useState } from 'react'

type Props = {
    content: string
    onChange: (html: string) => void
    placeholder?: string
}

export default function TiptapEditor({ content, onChange, placeholder = 'Start writing...' }: Props) {
    const [uploading, setUploading] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-blue-600 underline' },
            }),
            Image.configure({ inline: false, allowBase64: false }),
            Placeholder.configure({ placeholder }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    const addLink = useCallback(() => {
        const url = window.prompt('Enter URL:')
        if (!url || !editor) return
        editor.chain().focus().setLink({ href: url }).run()
    }, [editor])

    const uploadImage = useCallback(async (file: File) => {
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            const { url } = await res.json()
            if (url && editor) {
                editor.chain().focus().setImage({ src: url }).run()
            }
        } catch (err) {
            console.error('Image upload failed:', err)
        } finally {
            setUploading(false)
        }
    }, [editor])

    const handleImageInput = useCallback(() => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) await uploadImage(file)
        }
        input.click()
    }, [uploadImage])

    if (!editor) return null

    const ToolbarButton = ({
        onClick,
        active,
        children,
        title,
    }: {
        onClick: () => void
        active?: boolean
        children: React.ReactNode
        title: string
    }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            style={{
                backgroundColor: active ? '#2563eb' : 'transparent',
                color: active ? '#ffffff' : '#9ca3af',
                border: '1px solid #374151',
            }}
            className="px-2.5 py-1.5 rounded text-xs font-medium hover:bg-gray-700 hover:text-white transition-colors"
        >
            {children}
        </button>
    )

    return (
        <div
            style={{ border: '1px solid #374151', backgroundColor: '#111827' }}
            className="rounded-lg overflow-hidden"
        >
            {/* Toolbar */}
            <div
                style={{ borderBottom: '1px solid #374151', backgroundColor: '#1f2937' }}
                className="px-3 py-2 flex flex-wrap gap-1.5"
            >
                {/* Text style */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    title="Bold"
                >
                    <strong>B</strong>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    title="Italic"
                >
                    <em>I</em>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    active={editor.isActive('underline')}
                    title="Underline"
                >
                    <span className="underline">U</span>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    active={editor.isActive('strike')}
                    title="Strikethrough"
                >
                    <span className="line-through">S</span>
                </ToolbarButton>

                <div style={{ width: '1px', backgroundColor: '#374151' }} className="mx-1" />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive('heading', { level: 2 })}
                    title="Heading 2"
                >
                    H2
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive('heading', { level: 3 })}
                    title="Heading 3"
                >
                    H3
                </ToolbarButton>

                <div style={{ width: '1px', backgroundColor: '#374151' }} className="mx-1" />

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    • List
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    title="Ordered List"
                >
                    1. List
                </ToolbarButton>

                <div style={{ width: '1px', backgroundColor: '#374151' }} className="mx-1" />

                {/* Align */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    active={editor.isActive({ textAlign: 'left' })}
                    title="Align Left"
                >
                    ←
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    active={editor.isActive({ textAlign: 'center' })}
                    title="Align Center"
                >
                    ↔
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    active={editor.isActive({ textAlign: 'right' })}
                    title="Align Right"
                >
                    →
                </ToolbarButton>

                <div style={{ width: '1px', backgroundColor: '#374151' }} className="mx-1" />

                {/* Other */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                    title="Blockquote"
                >
                    " "
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    active={editor.isActive('codeBlock')}
                    title="Code Block"
                >
                    {'</>'}
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    active={false}
                    title="Horizontal Rule"
                >
                    ─
                </ToolbarButton>

                <div style={{ width: '1px', backgroundColor: '#374151' }} className="mx-1" />

                {/* Link & Image */}
                <ToolbarButton
                    onClick={addLink}
                    active={editor.isActive('link')}
                    title="Add Link"
                >
                    🔗
                </ToolbarButton>
                <ToolbarButton
                    onClick={handleImageInput}
                    active={false}
                    title={uploading ? 'Uploading...' : 'Add Image'}
                >
                    {uploading ? '...' : '🖼'}
                </ToolbarButton>

                <div style={{ width: '1px', backgroundColor: '#374151' }} className="mx-1" />

                {/* Undo/Redo */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    active={false}
                    title="Undo"
                >
                    ↩
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    active={false}
                    title="Redo"
                >
                    ↪
                </ToolbarButton>
                <div style={{ width: '1px', backgroundColor: '#374151' }} className="mx-1" />

                <ToolbarButton
                    onClick={() => {
                        const html = window.prompt('Paste HTML content:')
                        if (html) {
                            editor.chain().focus().setContent(html).run()
                        }
                    }}
                    active={false}
                    title="Insert HTML"
                >
                    {'</>'}
                </ToolbarButton>
            </div>

            {/* Editor content */}
            <EditorContent
                editor={editor}
                className="prose prose-invert max-w-none p-4 min-h-[400px] text-sm focus:outline-none"
                style={{ color: '#e5e7eb' }}
            />
        </div>
    )
}