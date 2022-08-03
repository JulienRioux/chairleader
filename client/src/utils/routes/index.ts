export const routes = {
  base: '/',
  auth: '/authenticate',
  privacy: '/privacy',
  tos: '/terms-of-service',
  pricing: '/pricing',
  magicLink: '/magic-link',
  completeSignup: '/complete-signup',
  storeNotFound: '/store-not-found',

  admin: {
    base: '/admin',
    inventory: '/admin/inventory',
    payments: '/admin/payments',
    pos: '/admin/point-of-sale',
    myStore: '/admin/my-store',
    search: '/admin/search',
    newProduct: '/admin/new-product',
    newCategory: '/admin/new-category',
  },

  store: {
    base: '/',
    inventory: '/inventory',
    search: '/inventory/search',
    cart: '/cart',
    confirmation: '/confirmation',
  },
};
