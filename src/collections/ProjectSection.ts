import { CollectionConfig } from "payload";
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { byRoleWithPublicRead } from '../access/byRole';

export const ProjectSection: CollectionConfig = {
   slug: "project-section",
   admin: {
      useAsTitle: "slug",
   },
   access: byRoleWithPublicRead(['admin', 'client']),
   fields: [
      {
         name: "slug",
         type: "text",
         required: true,
         unique: true,
         admin: {
            description: "Unique identifier for this project (e.g., 'nuces', 'project-two')",
         },
      },
      {
         name: "title",
         type: "text",
         validate: (value: any, options: any) => {
            const { locale, req } = options;
            const defaultLocale = req?.payload?.config?.localization?.defaultLocale ?? 'en';
            if (locale === defaultLocale && !value) {
               return 'This field is required';
            }
            return true;
         },
         localized: true,
      },
      {
         name: "subtitle",
         type: "text",
         required: false,
         localized: true,
         admin: {
            description: "Optional subtitle for the project section",
         },
      },
      {
         name: "description",
         type: "richText",
         validate: (value: any, options: any) => {
            const { locale, req } = options;
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
         name: "image",
         type: "upload",
         relationTo: "media",
         required: true,
      },
      {
         name: "gallery",
         type: "relationship",
         relationTo: "gallery",
         required: false,
         admin: {
            description: "Optional gallery to display below the section",
         },
      },
      {
         name: "destination",
         type: "select",
         required: false,
         options: [
            { label: "Works", value: "works" },
            { label: "Installations", value: "installations" },
         ],
      },
      {
         name: "mainProject",
         type: "relationship",
         relationTo: "project-section",
         required: false,
      },
   ],
};