import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
   slug: 'users',
   admin: {
      useAsTitle: 'email',
      hidden: ({ user }) => (user as any)?.role !== 'admin',
   },
   auth: true,
   access: {
      read: ({ req: { user } }) => (user as any)?.role === 'admin',
      create: ({ req: { user } }) => (user as any)?.role === 'admin',
      update: ({ req: { user } }) => (user as any)?.role === 'admin',
      delete: ({ req: { user } }) => (user as any)?.role === 'admin',
   },
   fields: [
      {
         name: 'role',
         type: 'select',
         required: true,
         defaultValue: 'client',
         options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Client', value: 'client' },
         ],
         admin: {
            position: 'sidebar',
         },
      },
      // Email added by default
      // Add more fields as needed
   ],
};