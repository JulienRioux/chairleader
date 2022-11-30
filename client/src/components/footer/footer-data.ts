import { routes } from 'utils';

export const defaultFooterData = [
  {
    content: [
      { title: 'Home', to: routes.base },
      { title: 'Pricing', to: routes.pricing },
      { title: 'Features', to: routes.features },
      // { title: 'NFTs', to: routes.mintNft },
      { title: 'Authenticate', to: routes.auth },
    ],
    title: 'Product',
  },
  {
    content: [
      { href: 'https://twitter.com/chairleader_app', title: 'Twitter' },
      { href: 'https://discord.gg/sbTcWHkKBN', title: 'Discord' },
      { href: 'https://medium.com/chairleader-xyz', title: 'Blog' },
    ],
    title: 'Social',
  },
  {
    content: [
      { title: 'Privacy policy', to: routes.static.privacy },
      { title: 'Terms of service', to: routes.static.termsOfService },
    ],
    title: 'Legal',
  },
  {
    content: [
      {
        href: 'https://vanilla-death-2ff.notion.site/Job-at-Chairleader-xyz-88f18c99bada46c3b3f98dc571a1f531',
        title: 'Jobs',
      },
      {
        href: 'mailto:investors@chairleader.xyz',
        title: 'Investors',
      },
      { href: 'mailto:hello@chairleader.xyz', title: 'Contact' },
      {
        href: 'https://chairleader.canny.io/',
        title: 'Send feedback',
      },
      { title: 'Changelog', href: 'https://chairleader.canny.io/changelog' },
    ],
    title: 'Other',
  },
];

export const storeFooterData = [
  {
    content: [
      {
        title: 'Chairleader.xyz 👋',
        href: `https://chairleader.xyz/${routes.base}`,
      },
    ],
    title: 'Product',
  },
  {
    content: [
      { href: 'https://twitter.com/chairleader_app', title: 'Twitter' },
      { href: 'https://discord.gg/sbTcWHkKBN', title: 'Discord' },
      { href: 'https://medium.com/chairleader-xyz', title: 'Blog' },
    ],
    title: 'Social',
  },
  {
    content: [
      {
        title: 'Privacy policy',
        href: `https://chairleader.xyz/${routes.static.privacy}`,
      },
      {
        title: 'Terms of service',
        href: `https://chairleader.xyz/${routes.static.termsOfService}`,
      },
    ],
    title: 'Legal',
  },
  {
    content: [
      {
        href: 'https://vanilla-death-2ff.notion.site/Job-at-Chairleader-xyz-88f18c99bada46c3b3f98dc571a1f531',
        title: 'Jobs',
      },
      {
        href: 'mailto:investors@chairleader.xyz',
        title: 'Investors',
      },
      {
        href: 'https://chairleader.canny.io/',
        title: 'Send feedback',
      },
    ],
    title: 'Other',
  },
];
