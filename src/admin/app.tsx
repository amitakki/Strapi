/**
 * Strapi v5 Admin Configuration
 * src/admin/app.tsx
 */

export default {
  config: {
    locales: ['en'],
  },

  bootstrap(app: any) {
    console.log('🚀 Bootstrapping custom admin...');
  },
};