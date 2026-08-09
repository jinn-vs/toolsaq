'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'

export default function ToolsSearch({ placeholder = 'Search tools...' }: { placeholder?: string }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (term) {
            params.set('q', term)
        } else {
            params.delete('q')
        }
        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`)
        })
    }

    return (
        <div className="relative">
            <input
                type="text"
                defaultValue={searchParams.get('q') ?? ''}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={placeholder}
                style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    color: '#111827',
                }}
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors"
            />
            {isPending && (
                <div className="absolute right-3 top-3">
                    <div
                        style={{ borderColor: '#e5e7eb', borderTopColor: '#2563eb' }}
                        className="w-4 h-4 rounded-full border-2 animate-spin"
                    />
                </div>
            )}
        </div>
    )
}