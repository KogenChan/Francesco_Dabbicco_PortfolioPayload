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
         name: 'mainWork',
         type: 'relationship',
         relationTo: 'media',
         hasMany: false,
         required: false,
         admin: {
            description: 'If this is an additional image, link to the main work here (auto-set when used as additional image)',
            readOnly: true,
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
   hooks: {
      afterChange: [
         async ({ doc, req, previousDoc }) => {
            // Get the additional images array
            const additionalImages = doc.additionalImages || [];
            const previousAdditionalImages = previousDoc?.additionalImages || [];

            // Convert to arrays of IDs for comparison
            const currentIds = additionalImages.map((img: any) => 
               typeof img === 'string' ? img : img.id
            );
            const previousIds = previousAdditionalImages.map((img: any) =>
               typeof img === 'string' ? img : img.id
            );

            // Find newly added images
            const newlyAdded = currentIds.filter((id: any) => !previousIds.includes(id));

            // Update mainWork for newly added additional images
            if (newlyAdded.length > 0) {
               for (const imageId of newlyAdded) {
                  await req.payload.update({
                     collection: 'media',
                     id: imageId as string,
                     data: {
                        mainWork: doc.id,
                     },
                  });
               }
            }

            // Find removed images and clear their mainWork if it points to this doc
            const removed = previousIds.filter((id: any) => !currentIds.includes(id));
            if (removed.length > 0) {
               for (const imageId of removed) {
                  // Fetch the image to check if its mainWork points to this doc
                  const image = await req.payload.findByID({
                     collection: 'media',
                     id: imageId as string,
                  });

                  const mainWorkId = typeof image.mainWork === 'string' 
                     ? image.mainWork 
                     : image.mainWork?.id;

                  if (mainWorkId === doc.id) {
                     await req.payload.update({
                        collection: 'media',
                        id: imageId as string,
                        data: {
                           mainWork: null,
                        },
                     });
                  }
               }
            }

            return doc;
         },
      ],
   },
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