import type { Config } from 'payload'

export const webpConverter = (config: Config): Config => {
   return {
      ...config,
      admin: {
         ...config.admin,
         components: {
            ...config.admin?.components,
            beforeDashboard: [
               ...(config.admin?.components?.beforeDashboard || []),
               '/components/WebPUploadInjector#WebPUploadInjector',
            ],
         },
      },
   }
};