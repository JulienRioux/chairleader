import { Button, Icon, UnstyledExternalLink } from 'components-library';

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
import shippingSetup from 'assets/features/shipping-setup.png';
import ressources from 'assets/features/ressources.png';

import background1 from './background/background-1.png';
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
    description:
      'Sign up & log in with one click. Authenticate to our platform on an ongoing basis via one-click, passwordless login. With Email Magic Links.',
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
  {
    title: 'Ressources helping you to succeed',
    description: (
      <div>
        <div style={{ marginBottom: '20px' }}>
          At Chairleader, we thrive to see you succeeding. That's why we're
          developping constantly building tools that will help you build your
          business.
        </div>

        <UnstyledExternalLink
          href="https://vanilla-death-2ff.notion.site/Platform-onboarding-390b6774ff7146d5a758aacb196ac3c8"
          target="_blank"
        >
          <Button>
            Explore ressources{' '}
            <Icon style={{ marginLeft: '4px' }} name="arrow_forward" />
          </Button>
        </UnstyledExternalLink>
      </div>
    ),
    imgSrc: ressources,
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
  {
    title: 'Products with variants',
    description:
      'Creates products with variants with ease. Add multiple sizes, colors, and more.',
    imgSrc: productVariants,
  },
  {
    title: 'Shipping made easy',
    description:
      'Setting up shipping regions has never been easier with Chairleader.',
    imgSrc: shippingSetup,
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
    backgroundImage: background1,
  },
  {
    title: 'Seamless experience',
    description:
      'Chairleader creates a seamless experience for store owners and online shoppers.',
    features: uiFeatures,
    backgroundImage: background2,
  },
  {
    title: 'Everything you need to succeed',
    description: 'Manage and customize your store easily with Chairleader.',
    features: storeFeatures,
    backgroundImage: background3,
  },
];
