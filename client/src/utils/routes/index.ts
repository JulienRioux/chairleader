export const routes = {
  base: '/',
  auth: '/authenticate',
  pricing: '/pricing',
  magicLink: '/magic-link',
  completeSignup: '/complete-signup',
  storeNotFound: '/store-not-found',
  static: {
    base: '/static',
    privacy: '/static/privacy',
    termsOfService: '/static/terms-of-service',
  },

  admin: {
    base: '/admin',
    inventory: '/admin/inventory',
    payments: '/admin/payments',
    pos: '/admin/point-of-sale',
    myStore: '/admin/my-store',
    search: '/admin/search',
    newProduct: '/admin/new-product',
    newCategory: '/admin/new-category',
    dashboard: '/admin/dashboard',
    tokenGating: '/admin/token-gating',
  },

  store: {
    base: '/',
    inventory: '/inventory',
    search: '/inventory/search',
    cart: '/cart',
    payment: '/payment',
    confirmation: '/confirmation',
  },
};
