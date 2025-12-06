// payload.config.ts
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
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
   // Add your production URLs here
   cors: [
      'http://localhost:5173', // React dev server
      process.env.FRONTEND_URL,
   ].filter((url): url is string => Boolean(url)),
   // Add serverURL for proper URL generation
   serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
   plugins: [
      // storage-adapter-placeholder
   ],
});