import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/roles'

export const Posts: CollectionConfig = {
  slug: 'posts',
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        const wasPublished = originalDoc?.status === 'published'
        const isPublished = data.status === 'published'
        if (isPublished && !wasPublished && !data.publishedDate) {
          data.publishedDate = new Date().toISOString()
        }
        return data
      },
    ],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'featured', 'publishedDate'],
  },
  access: {
    read: () => true,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-generated from title. Edit only if needed.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary shown in article cards and meta description.',
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'WWE', value: 'WWE' },
        { label: 'AEW', value: 'AEW' },
        { label: 'Opinion', value: 'Opinion' },
        { label: 'India', value: 'India' },
        { label: 'Results', value: 'Results' },
        { label: 'Retro', value: 'Retro' },
      ],
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Feature this article on homepage',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'If multiple articles are featured, the most recent is shown.',
      },
    },
    {
      name: 'breakingNews',
      type: 'checkbox',
      label: 'Breaking News',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Shows BREAKING badge on cards and adds article to the news ticker.',
      },
    },
    {
      name: 'readTime',
      type: 'number',
      label: 'Read Time (minutes)',
      admin: {
        position: 'sidebar',
        description: 'Estimated read time in minutes.',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      admin: {
        description: 'e.g. Roman Reigns, WrestleMania — used for SEO and filtering.',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'seoTitle',
      type: 'text',
      label: 'SEO Title',
      admin: {
        description: 'Leave blank to use article title.',
      },
    },
    {
      name: 'seoDescription',
      type: 'text',
      label: 'SEO Description',
      admin: {
        description: 'Meta description for Google, 150–160 characters.',
      },
    },
  ],
}
