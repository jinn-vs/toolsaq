import { adminClient } from './admin'

// ========== CATEGORIES ==========
export async function getAllCategories() {
    const { data, error } = await adminClient
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

    if (error) throw error
    return data
}

export async function getCategoryBySlug(slug: string) {
    const { data, error } = await adminClient
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) throw error
    return data
}

// ========== TOOLS ==========
export async function getAllTools() {
    const { data, error } = await adminClient
        .from('tools')
        .select(`
      *,
      category:categories(id, name, slug)
    `)
        .order('name', { ascending: true })

    if (error) throw error
    return data
}

export async function getFeaturedTools() {
    const { data, error } = await adminClient
        .from('tools')
        .select(`
      *,
      category:categories(id, name, slug)
    `)
        .eq('is_featured', true)
        .order('name', { ascending: true })
        .limit(6)

    if (error) throw error
    return data
}

export async function getToolBySlug(slug: string) {
    const { data, error } = await adminClient
        .from('tools')
        .select(`
      *,
      category:categories(id, name, slug)
    `)
        .eq('slug', slug)
        .single()

    if (error) throw error
    return data
}

export async function getToolsByCategory(categorySlug: string) {
    const { data, error } = await adminClient
        .from('tools')
        .select(`
      *,
      category:categories(id, name, slug)
    `)
        .eq('categories.slug', categorySlug)
        .order('name', { ascending: true })

    if (error) throw error
    return data
}

export async function getAlternativeTools(slug: string, categoryId: string) {
    const { data, error } = await adminClient
        .from('tools')
        .select(`
      *,
      category:categories(id, name, slug)
    `)
        .neq('slug', slug)
        .eq('category_id', categoryId)
        .order('name', { ascending: true })

    if (error) throw error
    return data
}

export async function getAllToolSlugs() {
    const { data, error } = await adminClient
        .from('tools')
        .select('slug')

    if (error) throw error
    return data
}

// ========== ARTICLES ==========
export async function getAllArticles() {
    const { data, error } = await adminClient
        .from('articles')
        .select(`
      *,
      author:authors(id, name, slug, photo_url),
      category:categories(id, name, slug)
    `)
        .eq('is_published', true)
        .order('published_at', { ascending: false })

    if (error) throw error
    return data
}

export async function getLatestArticles(limit = 3) {
    const { data, error } = await adminClient
        .from('articles')
        .select(`
      *,
      author:authors(id, name, slug, photo_url),
      category:categories(id, name, slug)
    `)
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(limit)

    if (error) throw error
    return data
}

export async function getArticleBySlug(slug: string) {
    const { data, error } = await adminClient
        .from('articles')
        .select(`
      *,
      author:authors(id, name, slug, photo_url, bio),
      category:categories(id, name, slug)
    `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

    if (error) throw error
    return data
}

export async function getAllArticleSlugs() {
    const { data, error } = await adminClient
        .from('articles')
        .select('slug')
        .eq('is_published', true)

    if (error) throw error
    return data
}

// ========== AUTHORS ==========
export async function getAuthorBySlug(slug: string) {
    const { data, error } = await adminClient
        .from('authors')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) throw error
    return data
}

// ========== COMPARISONS ==========
export async function getAllComparisons() {
    const { data, error } = await adminClient
        .from('comparisons')
        .select(`
      *,
      tool_a:tools!comparisons_tool_a_id_fkey(id, name, slug, logo_url, tagline),
      tool_b:tools!comparisons_tool_b_id_fkey(id, name, slug, logo_url, tagline)
    `)
        .eq('is_published', true)
        .order('published_at', { ascending: false })

    if (error) throw error
    return data
}

export async function getComparisonBySlug(slug: string) {
    const { data, error } = await adminClient
        .from('comparisons')
        .select(`
      *,
      tool_a:tools!comparisons_tool_a_id_fkey(
        id, name, slug, logo_url, tagline, pros, cons, website,
        category:categories(id, name, slug)
      ),
      tool_b:tools!comparisons_tool_b_id_fkey(
        id, name, slug, logo_url, tagline, pros, cons, website,
        category:categories(id, name, slug)
      )
    `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

    if (error) throw error
    return data
}

export async function getAllComparisonSlugs() {
    const { data, error } = await adminClient
        .from('comparisons')
        .select('slug')
        .eq('is_published', true)

    if (error) throw error
    return data
}

// ========== CLICKS ==========
export async function trackClick(toolId: string, toolSlug: string) {
    const { error } = await adminClient
        .from('clicks')
        .insert({ tool_id: toolId, tool_slug: toolSlug })

    if (error) throw error
}