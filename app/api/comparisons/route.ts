import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const { data, error } = await adminClient
        .from('comparisons')
        .select(`
      *,
      tool_a:tools!comparisons_tool_a_id_fkey(id, name, slug),
      tool_b:tools!comparisons_tool_b_id_fkey(id, name, slug)
    `)
        .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { data, error } = await adminClient
        .from('comparisons')
        .insert(body)
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/revalidate`, {
        method: 'POST',
        headers: { 'x-revalidate-secret': process.env.REVALIDATE_SECRET! },
        body: JSON.stringify({ type: 'comparison', slug: data.slug }),
    })

    return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { id, ...updates } = body

    const { data, error } = await adminClient
        .from('comparisons')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/revalidate`, {
        method: 'POST',
        headers: { 'x-revalidate-secret': process.env.REVALIDATE_SECRET! },
        body: JSON.stringify({ type: 'comparison', slug: data.slug }),
    })

    return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, slug } = await request.json()
    const { error } = await adminClient.from('comparisons').delete().eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/revalidate`, {
        method: 'POST',
        headers: { 'x-revalidate-secret': process.env.REVALIDATE_SECRET! },
        body: JSON.stringify({ type: 'comparison', slug }),
    })

    return NextResponse.json({ success: true })
}