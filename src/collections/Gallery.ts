// cms/src/collections/Gallery.ts
import { CollectionConfig } from "payload";

export const Gallery: CollectionConfig = {
   slug: "gallery",
   admin: {
      useAsTitle: "name",
   },
   access: {
      read: () => true,
   },
   fields: [
      {
         name: "name",
         type: "text",
         required: true,
         admin: {
            description: "Name to identify this gallery (e.g., 'Nuces Gallery', 'Project Two Gallery')",
         },
      },
      {
         name: "slug",
         type: "text",
         required: true,
         unique: true,
         admin: {
            description: "Unique identifier for this gallery",
         },
      },
      {
         name: "images",
         type: "array",
         required: true,
         minRows: 1,
         fields: [
            {
               name: "image",
               type: "upload",
               relationTo: "media",
               required: true,
            },
            {
               name: "alt",
               type: "text",
               required: false,
               admin: {
                  description: "Alternative text for the image",
               },
            },
         ],
      },
   ],
};