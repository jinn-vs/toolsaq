import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'comparison',
    title: 'Comparison',
    type: 'document',
    fields: [
        defineField({
            name: 'productA',
            title: 'Product A',
            type: 'reference',
            to: [{ type: 'software' }],
        }),
        defineField({
            name: 'productB',
            title: 'Product B',
            type: 'reference',
            to: [{ type: 'software' }],
        }),
        defineField({ name: 'slug', title: 'Slug', type: 'slug' }),
        defineField({ name: 'verdict', title: 'Verdict', type: 'array', of: [{ type: 'block' }] }),
        defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
    ],
})