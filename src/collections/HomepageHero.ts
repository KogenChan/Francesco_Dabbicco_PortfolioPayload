import { CollectionConfig } from "payload";
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { byRoleWithPublicRead } from '../access/byRole';

export const HomepageHero: CollectionConfig = {
   slug: "homepage-hero",
   admin: {
      useAsTitle: "title",
   },
   access: byRoleWithPublicRead(['admin', 'client']),
   fields: [
      {
         name: "title",
         type: "text",
         required: true,
      },
      {
         name: "text",
         type: "richText",
         required: true,
         editor: lexicalEditor({
            features: ({ defaultFeatures }) => defaultFeatures,
         }),
      },
      {
         name: "image",
         type: "upload",
         relationTo: "media",
         required: true,
      },
   ],
};