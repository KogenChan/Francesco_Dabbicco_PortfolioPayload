// cms/src/collections/HomepageHero.ts
import { CollectionConfig } from "payload";

export const HomepageHero: CollectionConfig = {
   slug: "homepage-hero",
   admin: {
      useAsTitle: "title",
   },
   access: {
      read: () => true,
   },
   fields: [
      {
         name: "title",
         type: "text",
         required: true,
      },
      {
         name: "subtitle",
         type: "textarea",
         required: true,
      },
      {
         name: "image",
         type: "upload",
         relationTo: "media",
         required: true,
      },
   ],
};