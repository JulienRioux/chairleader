/// <reference types="react-scripts" />

interface Window {
  solana: any;
  solflare: any;
}

declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '@sanity/block-content-to-react';

declare module '@sanity/image-url';

declare module '@sanity/client';
