import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrSelf } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'displayName',
  },
  auth: true,
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Admins can delete posts, media, and users.',
      },
    },
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
