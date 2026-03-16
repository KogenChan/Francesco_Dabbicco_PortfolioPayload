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
         localized: true,
         validate: (value: any, options: any) => {
            const { locale, req } = options;
            const defaultLocale = req?.payload?.config?.localization?.defaultLocale ?? 'en';
            if (locale === defaultLocale && !value) {
               return 'This field is required';
            }
            return true;
         },
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