import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'adSlot',
    title: 'Ad Slot',
    type: 'document',
    fields: [
        defineField({
            name: 'placement',
            title: 'Placement',
            type: 'string',
            options: { list: ['Top Bar', 'Sidebar', 'Inline'] },
        }),
        defineField({ name: 'image', title: 'Image', type: 'image' }),
        defineField({ name: 'targetUrl', title: 'Target URL', type: 'url' }),
        defineField({ name: 'active', title: 'Active', type: 'boolean' }),
    ],
})