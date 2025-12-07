import { CollectionConfig } from "payload";
import { byRoleWithPublicRead } from '../access/byRole';

export const CarouselItem: CollectionConfig = {
   slug: "carousel-item",
   access: byRoleWithPublicRead(['admin', 'client']),
   fields: [
      {
         name: "image",
         type: "upload",
         relationTo: "media",
         required: true,
      },
      {
         name: "order",
         type: "number",
         defaultValue: 0,
      },
   ],
};