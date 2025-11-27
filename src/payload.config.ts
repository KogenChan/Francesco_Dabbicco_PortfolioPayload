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
   cors: ['http://localhost:5173'], // allow React dev server
   plugins: [
      // storage-adapter-placeholder
   ],
});
