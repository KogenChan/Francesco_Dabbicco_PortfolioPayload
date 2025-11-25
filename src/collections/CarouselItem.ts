// cms/src/collections/CarouselItem.ts
import { CollectionConfig } from "payload";

export const CarouselItem: CollectionConfig = {
  slug: "carousel-item",
  access: {
    read: () => true,
  },
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
