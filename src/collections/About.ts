import { CollectionConfig } from "payload";
import { lexicalEditor } from '@payloadcms/richtext-lexical';

export const About: CollectionConfig = {
   slug: "about",
   access: {
      read: () => true,
   },
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