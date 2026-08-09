import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { adminClient } from '@/lib/supabase/admin'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/admin/login')

    // Stats fetch karein
    const [
        { count: toolsCount },
        { count: articlesCount },
        { count: categoriesCount },
        { count: comparisonsCount },
    ] = await Promise.all([
        adminClient.from('tools').select('*', { count: 'exact', head: true }),
        adminClient.from('articles').select('*', { count: 'exact', head: true }),
        adminClient.from('categories').select('*', { count: 'exact', head: true }),
        adminClient.from('comparisons').select('*', { count: 'exact', head: true }),
    ])

    const stats = [
        { label: 'Total Tools', count: toolsCount ?? 0, href: '/admin/dashboard/tools', color: '#2563eb' },
        { label: 'Total Articles', count: articlesCount ?? 0, href: '/admin/dashboard/articles', color: '#16a34a' },
        { label: 'Categories', count: categoriesCount ?? 0, href: '/admin/dashboard/categories', color: '#9333ea' },
        { label: 'Comparisons', count: comparisonsCount ?? 0, href: '/admin/dashboard/comparisons', color: '#ea580c' },
    ]

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p style={{ color: '#6b7280' }} className="text-sm mt-1">
                        Welcome back, {user.email}
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        style={{ border: '1px solid #1f2937', backgroundColor: '#111827' }}
                        className="rounded-xl p-5 hover:border-gray-600 transition-colors block"
                    >
                        <p style={{ color: '#6b7280' }} className="text-xs font-medium mb-1">
                            {stat.label}
                        </p>
                        <p style={{ color: stat.color }} className="text-3xl font-black">
                            {stat.count}
                        </p>
                    </Link>
                ))}
            </div>

            {/* Quick actions */}
            <h2 className="text-sm font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: '+ New Tool', href: '/admin/dashboard/tools/new', color: '#2563eb' },
                    { label: '+ New Article', href: '/admin/dashboard/articles/new', color: '#16a34a' },
                    { label: '+ New Category', href: '/admin/dashboard/categories', color: '#9333ea' },
                    { label: '+ New Author', href: '/admin/dashboard/authors', color: '#ea580c' },
                ].map((action) => (
                    <Link
                        key={action.label}
                        href={action.href}
                        style={{ backgroundColor: action.color }}
                        className="px-4 py-3 rounded-lg text-white text-sm font-semibold text-center hover:opacity-90 transition-opacity"
                    >
                        {action.label}
                    </Link>
                ))}
            </div>
        </div>
    )
}