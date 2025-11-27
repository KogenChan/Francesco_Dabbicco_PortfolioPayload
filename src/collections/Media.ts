import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Media: CollectionConfig = {
   slug: 'media',
   access: {
      read: () => true,
   },
   fields: [
      {
         name: 'alt',
         type: 'text',
         required: true,
      },
      {
         name: 'caption',
         type: 'richText',
         required: false,
         editor: lexicalEditor({
            features: ({ defaultFeatures }) => defaultFeatures,
         }),
         admin: {
            description: 'Optional caption/description for this image',
         },
      },
      {
         name: 'additionalImages',
         type: 'relationship',
         relationTo: 'media',
         hasMany: true,
         required: false,
         admin: {
            description: 'Additional images for this work (e.g., detail shots, alternate views)',
         },
      },
   ],
   upload: true,
};