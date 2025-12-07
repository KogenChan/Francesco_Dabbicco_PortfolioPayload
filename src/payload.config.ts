// payload.config.ts
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Existing collections
import { Users } from './collections/Users';
import { Media } from './collections/Media';

// New collections for homepage
import { HomepageHero } from './collections/HomepageHero';
import { CarouselItem } from './collections/CarouselItem';
import { ProjectSection } from './collections/ProjectSection';
import { Gallery } from './collections/Gallery';
import { About } from './collections/About';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
   admin: {
      user: Users.slug,
      importMap: {
         baseDir: path.resolve(dirname),
      },
      components: {
      afterNavLinks: [
         './src/components/WebPConverter#WebPConverter',
      ],
   },
   },
   collections: [
      Users,
      Media,
      HomepageHero,
      CarouselItem,
      Gallery,
      ProjectSection,
      About,
   ],
   editor: lexicalEditor(),
   secret: process.env.PAYLOAD_SECRET || '',
   typescript: {
      outputFile: path.resolve(dirname, 'payload-types.ts'),
   },
   db: mongooseAdapter({
      url: process.env.DATABASE_URI || process.env.MONGODB_URI || '',
   }),
   sharp,
   cors: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://fdart-payload.vercel.app',
      'https://*.vercel.app',
      process.env.FRONTEND_URL,
   ].filter((url): url is string => Boolean(url)),
   serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
   plugins: [
      s3Storage({
         collections: {
            media: {
               disablePayloadAccessControl: true,
               generateFileURL: ({ filename }) => {
                  return `${process.env.S3_PUBLIC_URL}/${filename}`;
               },
            },
         },
         bucket: process.env.S3_BUCKET!,
         config: {
            endpoint: process.env.S3_ENDPOINT,
            region: 'auto',
            credentials: {
               accessKeyId: process.env.S3_ACCESS_KEY_ID!,
               secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
            },
            forcePathStyle: true,
         },
      }),
   ],
});