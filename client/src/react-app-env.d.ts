/// <reference types="react-scripts" />

interface Window {
  solana: any;
}

declare module '*.mp4' {
  const src: string;
  export default src;
}
