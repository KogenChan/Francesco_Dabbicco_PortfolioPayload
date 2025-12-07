import { CollectionConfig } from "payload";
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { byRoleWithPublicRead } from '../access/byRole';

export const ProjectSection: CollectionConfig = {
   slug: "project-section",
   admin: {
      useAsTitle: "title",
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
         required: true,
      },
      {
         name: "subtitle",
         type: "text",
         required: false,
         admin: {
            description: "Optional subtitle for the project section",
         },
      },
      {
         name: "description",
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
      {
         name: "gallery",
         type: "relationship",
         relationTo: "gallery",
         required: false,
         admin: {
            description: "Optional gallery to display below the section",
         },
      },
   ],
};