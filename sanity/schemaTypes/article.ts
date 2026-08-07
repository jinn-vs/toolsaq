import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'article',
    title: 'Article',
    type: 'document',
    fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{ type: 'author' }],
        }),
        defineField({
            name: 'section',
            title: 'Section',
            type: 'string',
            options: {
                list: ['Guides & Tutorials', 'Software Reviews', 'Alternatives', 'Comparisons'],
            },
        }),
        defineField({ name: 'featuredImage', title: 'Featured Image', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
        defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
        defineField({
            name: 'relatedSoftware',
            title: 'Related Software',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'software' }] }],
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