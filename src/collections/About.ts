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
         validate: (value, options) => {
            const { locale, req } = options as any;
            const defaultLocale = req?.payload?.config?.localization?.defaultLocale ?? 'en';
            if (locale === defaultLocale && !value) {
               return 'This field is required';
            }
            return true;
         },
         localized: true,
         editor: lexicalEditor({
            features: ({ defaultFeatures }) => defaultFeatures,
         }),
      },
      {
         name: "bio",
         type: "richText",
         validate: (value, options) => {
            const { locale, req } = options as any;
            const defaultLocale = req?.payload?.config?.localization?.defaultLocale ?? 'en';
            if (locale === defaultLocale && !value) {
               return 'This field is required';
            }
            return true;
         },
         localized: true,
         editor: lexicalEditor({
            features: ({ defaultFeatures }) => defaultFeatures,
         }),
      },
      {
         name: "exhibits",
         type: "richText",
         validate: (value, options) => {
            const { locale, req } = options as any;
            const defaultLocale = req?.payload?.config?.localization?.defaultLocale ?? 'en';
            if (locale === defaultLocale && !value) {
               return 'This field is required';
            }
            return true;
         },
         localized: true,
         editor: lexicalEditor({
            features: ({ defaultFeatures }) => defaultFeatures,
         }),
      },
      {
         name: "publications",
         type: "richText",
         validate: (value, options) => {
            const { locale, req } = options as any;
            const defaultLocale = req?.payload?.config?.localization?.defaultLocale ?? 'en';
            if (locale === defaultLocale && !value) {
               return 'This field is required';
            }
            return true;
         },
         localized: true,
         editor: lexicalEditor({
            features: ({ defaultFeatures }) => defaultFeatures,
         }),
      },
      {
         name: "illustrations",
         type: "richText",
         validate: (value, options) => {
            const { locale, req } = options as any;
            const defaultLocale = req?.payload?.config?.localization?.defaultLocale ?? 'en';
            if (locale === defaultLocale && !value) {
               return 'This field is required';
            }
            return true;
         },
         localized: true,
         editor: lexicalEditor({
            features: ({ defaultFeatures }) => defaultFeatures,
         }),
      },
   ],
};