import { Icon } from 'components-library';

import otp from 'assets/features/otp.png';
import multiWallet from 'assets/features/multi-wallet.png';
import tokenGating from 'assets/features/token-gating.png';
import solanaMetaplex from 'assets/features/solana-metaplex.png';
import cryptoPayment from 'assets/features/crypto-payment.png';
import fees from 'assets/features/fees.png';
import lightDarkMode from 'assets/features/light-dark-mode.png';
import themeCustom from 'assets/features/theme-custom.png';
import trackOrders from 'assets/features/track-orders.png';
import manageInventory from 'assets/features/manage-inventory.png';
import emailNotification from 'assets/features/email-notification.png';
import productVariants from 'assets/features/product-variants.png';
import dashboard from 'assets/features/dashboard.png';
import commingSoon from 'assets/features/comming-soon.png';
import inAppNft from 'assets/features/in-app-nft.png';
import background1 from './background/background-1.svg';
import background2 from './background/background-2.png';
import background3 from './background/background-3.png';

const web3Features = [
  {
    title: 'In-app NFT creation',
    description:
      'Create NFTs for Token Gating and NFT memberships without leaving the app.',
    imgSrc: inAppNft,
  },
  {
    title: 'Token gating and NFT membership',
    description:
      'Create product Token Gating and NFT membership to create value for your community members.',
    imgSrc: tokenGating,
  },
  {
    title: 'Crypto payments',
    description:
      'Accept crypto payments in a few seconds. Cryptocurrency payment provides fast transactions and low processing fees.',
    imgSrc: cryptoPayment,
  },
  {
    title: "Pay only when you're selling",
    description:
      'Access a complete ecommerce platform with simple, pay-as-you-go pricing. 1% fee per transaction.',
    imgSrc: fees,
  },
  {
    title: 'Web3 Loyalty programs',
    description: 'Start web3 loyalty programs in a few clicks.',
    imgSrc: commingSoon,
  },
  {
    title: 'Powered by Solana and Metaplex',
    description: (
      <>
        {`Chairleader's unique data ecosystem reveals opportunities where your business can grow with the `}
        <a href="https://solana.com/" target="_blank" rel="noreferrer">
          Solana network
          <Icon style={{ margin: '0 0 4px 4px' }} name="launch" />
        </a>{' '}
        and{' '}
        <a href="https://www.metaplex.com/" target="_blank" rel="noreferrer">
          Metaplex
          <Icon style={{ margin: '0 0 4px 4px' }} name="launch" />
        </a>
        . From accept cryptocurrency payments, NFTs token gating, and many more!
      </>
    ),
    imgSrc: solanaMetaplex,
  },
];

const uiFeatures = [
  {
    title: 'One-Time-Password',
    description: 'Securely login to your eCommerce plaftorm using OTP.',
    imgSrc: otp,
  },
  {
    title: 'Light/Dark mode',
    description: 'Let your users decides to use the Light or Dark mode.',
    imgSrc: lightDarkMode,
  },
  {
    title: 'Multi-wallet connection',
    description:
      'Let your user connects with their favorites wallets.including Phantom, Solflare, Torus, Glow and Slope.',
    imgSrc: multiWallet,
  },
  {
    title: 'Theme customization',
    description:
      'Start your online store has never been more easy. Customize your theme with ease, from colors & images to social icons.',
    imgSrc: themeCustom,
  },
];

const storeFeatures = [
  {
    title: 'Manage inventory',
    description:
      'Save time and money with tools that help you manage, monitor and move your inventory.',
    imgSrc: manageInventory,
  },
  {
    title: 'Track and manage your orders',
    description: 'Easily manage and fulfill orders from placement to delivery.',
    imgSrc: trackOrders,
  },
  {
    title: 'Email notifications',
    description:
      'Get email notifications on new orders and send order confirmation automagically.',
    imgSrc: emailNotification,
  },
  // {
  //   title: 'Add sale tax and shipping fees',
  //   description:
  //     'Create customized sale tax and use multiple shipping fees for customers accross the globe.',
  //   imgSrc: otp,
  // },
  {
    title: 'Products with variants',
    description:
      'Creates products with variants with ease. Add multiple sizes, colors, and more.',
    imgSrc: productVariants,
  },
  {
    title: 'Seller dashboard',
    description: 'Track your sales with our seller dashboard.',
    imgSrc: dashboard,
  },
];

export const featuresList = [
  {
    title: 'Improve customers engagement with web3',
    description:
      'Use token gating, loyalties programs, and NFTs membership to grow your business and brand by unlocking superior customer experience.',
    features: web3Features,
    backgroundImage: 'https://meshgradient.com/gallery/8.png',
  },
  {
    title: 'Seamless experience',
    description:
      'Chairleader creates a seamless experience for store owners and online shoppers.',
    features: uiFeatures,
    backgroundImage: background2,
  },
  {
    title: 'Store features',
    description:
      'Accelerate deal execution Optimize transaction costs Save professional time Streamline collaboration with advisors.',
    features: storeFeatures,
    backgroundImage: background3,
  },
];