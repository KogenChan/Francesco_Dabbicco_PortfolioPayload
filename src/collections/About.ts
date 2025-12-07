import { CollectionConfig } from "payload";
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { byRoleWithPublicRead } from '../access/byRole';

export const About: CollectionConfig = {
   slug: "about",
   access: byRoleWithPublicRead(['admin', 'client']),
   fields: [
      {
         name: "statement",
         type: "richText",
         required: true,
         editor: lexicalEditor({
            features: ({ defaultFeatures }) => defaultFeatures,
         }),
      },
      {
         name: "bio",
         type: "richText",
         required: true,
         editor: lexicalEditor({
            features: ({ defaultFeatures }) => defaultFeatures,
         }),
      },
      {
         name: "history",
         type: "richText",
         required: true,
         editor: lexicalEditor({
            features: ({ defaultFeatures }) => defaultFeatures,
         }),
      },
   ],
};