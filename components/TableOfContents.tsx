'use client'

import { useEffect, useState } from 'react'

type Heading = {
    id: string
    text: string
    level: number
}

function extractHeadings(html: string): Heading[] {
    const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi
    const headings: Heading[] = []
    let match

    while ((match = regex.exec(html)) !== null) {
        const level = parseInt(match[1])
        const text = match[2].replace(/<[^>]*>/g, '')
        const id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        headings.push({ id, text, level })
    }

    return headings
}

export default function TableOfContents({ html }: { html: string }) {
    const [activeId, setActiveId] = useState('')
    const headings = extractHeadings(html)

    useEffect(() => {
        // Add IDs to headings in DOM
        const article = document.querySelector('.article-body')
        if (!article) return

        const domHeadings = article.querySelectorAll('h2, h3')
        domHeadings.forEach((el) => {
            const text = el.textContent ?? ''
            const id = text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            el.id = id
        })

        // Intersection observer for active heading
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: '0px 0px -80% 0px' }
        )

        domHeadings.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [])

    if (headings.length === 0) return null

    return (
        <div
            style={{ border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}
            className="rounded-xl p-5"
        >
            <p style={{ color: '#111827' }} className="font-bold text-sm mb-4">
                Table of Contents
            </p>
            <nav className="space-y-2">
                {headings.map((heading) => (
                    <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        style={{
                            color: activeId === heading.id ? '#2563eb' : '#6b7280',
                            paddingLeft: heading.level === 3 ? '1rem' : '0',
                            fontWeight: activeId === heading.id ? '600' : '400',
                        }}
                        className="block text-xs hover:text-blue-600 transition-colors leading-relaxed"
                    >
                        {heading.text}
                    </a>
                ))}
            </nav>
        </div>
    )
}