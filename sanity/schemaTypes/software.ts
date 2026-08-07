import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'software',
    title: 'Software',
    type: 'document',
    fields: [
        defineField({ name: 'name', title: 'Name', type: 'string' }),
        defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } }),
        defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
        defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'category' }],
        }),
        defineField({ name: 'website', title: 'Website URL', type: 'url' }),
        defineField({
            name: 'pros',
            title: 'Pros',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'cons',
            title: 'Cons',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'faqs',
            title: 'FAQs',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'question', title: 'Question', type: 'string' },
                        { name: 'answer', title: 'Answer', type: 'text' },
                    ],
                },
            ],
        }),
    ],
})