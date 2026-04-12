import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'displayName',
  },
  auth: true,
  fields: [
    {
      name: 'displayName',
      type: 'text',
      label: 'Display Name',
      admin: {
        description: 'Shown as author name on articles e.g. John Smith.',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio',
      admin: {
        description: 'Short author bio shown on article pages.',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      label: 'Profile Photo',
      relationTo: 'media',
    },
  ],
}
