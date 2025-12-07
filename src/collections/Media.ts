import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { byRoleWithPublicRead } from '../access/byRole';

export const Media: CollectionConfig = {
   slug: 'media',
   access: byRoleWithPublicRead(['admin', 'client']),
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
   upload: {
      staticDir: 'media',
      imageSizes: [
         {
            name: 'thumbnail',
            width: 400,
            height: undefined,
            fit: 'inside',
            formatOptions: {
               format: 'webp',
               options: {
                  quality: 80,
               },
            },
         },
         {
            name: 'card',
            width: 800,
            height: undefined,
            fit: 'inside',
            formatOptions: {
               format: 'webp',
               options: {
                  quality: 85,
               },
            },
         },
         {
            name: 'full',
            width: 2400,
            height: undefined,
            fit: 'inside',
            formatOptions: {
               format: 'webp',
               options: {
                  quality: 90,
               },
            },
         },
      ],
      formatOptions: {
         format: 'webp',
         options: {
            quality: 90,
         },
      },
      mimeTypes: ['image/*'],
   },
};