import { Access } from 'payload'

// For collections that need public read access
export const byRoleWithPublicRead = (allowedRoles: string[] = []): {
   read: Access
   create: Access
   update: Access
   delete: Access
} => ({
   read: () => true, // Public read access
   create: ({ req: { user } }) => {
      if (!user) return false
      return allowedRoles.includes((user as any).role)
   },
   update: ({ req: { user } }) => {
      if (!user) return false
      return allowedRoles.includes((user as any).role)
   },
   delete: ({ req: { user } }) => {
      if (!user) return false
      return allowedRoles.includes((user as any).role)
   },
})

// For admin-only collections (like Users)
export const byRole = (allowedRoles: string[] = []): {
   read: Access
   create: Access
   update: Access
   delete: Access
} => ({
   read: ({ req: { user } }) => {
      if (!user) return false
      return allowedRoles.includes((user as any).role)
   },
   create: ({ req: { user } }) => {
      if (!user) return false
      return allowedRoles.includes((user as any).role)
   },
   update: ({ req: { user } }) => {
      if (!user) return false
      return allowedRoles.includes((user as any).role)
   },
   delete: ({ req: { user } }) => {
      if (!user) return false
      return allowedRoles.includes((user as any).role)
   },
});