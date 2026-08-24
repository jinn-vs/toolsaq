import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
    const secret = request.headers.get('x-revalidate-secret')

    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { type, slug } = body

        switch (type) {
            case 'tool':
                revalidatePath('/tools', 'page')
                revalidatePath(`/tools/${slug}`, 'page')
                revalidatePath(`/alternatives/${slug}`, 'page')
                revalidatePath('/', 'page')
                revalidatePath('/tools', 'layout')
                break
            case 'article':
                revalidatePath('/blog', 'page')
                revalidatePath(`/blog/${slug}`, 'page')
                revalidatePath('/', 'page')
                revalidatePath('/blog', 'layout')
                break
            case 'category':
                revalidatePath('/category', 'page')
                revalidatePath(`/category/${slug}`, 'page')
                revalidatePath('/', 'page')
                revalidatePath('/category', 'layout')
                break
            case 'comparison':
                revalidatePath('/compare/all', 'page')
                revalidatePath(`/compare/${slug}`, 'page')
                revalidatePath('/compare/all', 'layout')
                break
            default:
                revalidatePath('/', 'layout')
        }

        return NextResponse.json(
            { revalidated: true, type, slug },
            {
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'CDN-Cache-Control': 'no-store',
                    'Vercel-CDN-Cache-Control': 'no-store',
                },
            }
        )
    } catch {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
}