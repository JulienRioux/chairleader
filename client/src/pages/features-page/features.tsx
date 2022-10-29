import { Icon } from 'components-library';

import otp from 'assets/features/otp.jpg';
import multiWallet from 'assets/features/multi-wallet.jpg';
import nftCreation from 'assets/features/in-app-nft-creation.jpg';

const paymentFeatures = [
  {
    title: 'Powered by the Solana Network',
    description: (
      <>
        {`Chairleader's unique data ecosystem reveals opportunities where your business can grow with the `}
        <a href="https://solana.com/" target="_blank" rel="noreferrer">
          Solana network
          <Icon style={{ margin: '0 0 4px 4px' }} name="launch" />
        </a>
        . From accept cryptocurrency payments, NFTs token gating, and many more!
      </>
    ),
    imgSrc:
      'https://app.termgrid.com/wp-content/uploads/2021/12/fee-tracker.jpg',
  },
  {
    title: "Pay only when you're selling",
    description:
      'Access a complete ecommerce platform with simple, pay-as-you-go pricing. 1% fee per transaction.',
    imgSrc:
      'https://app.termgrid.com/wp-content/uploads/2021/12/grid-negotiation.jpg',
  },
  {
    title: 'Crypto payments',
    description: 'Securely share files with your counterparties',
    imgSrc: 'https://app.termgrid.com/wp-content/uploads/2021/12/data-room.jpg',
  },
];

const engagementFeatures = [
  {
    title: 'Token gating, loyalties programs, and NFTs membership',
    description:
      'Improve customers engagement with web3. Use token gating, loyalties programs, and NFTs membership to grow your business and brand by unlocking superior customer experience.',
    imgSrc: 'https://app.termgrid.com/wp-content/uploads/2021/12/data-room.jpg',
  },
  {
    title: 'Improve customers engagement',
    description:
      'Use token gating, loyalties programs, and NFTs membership to grow your business and brand by unlocking superior customer experience.',
    imgSrc:
      'https://app.termgrid.com/wp-content/uploads/2021/12/grid-negotiation.jpg',
  },
  {
    title: 'Powered by Metaplex',
    description: 'Securely share files with your counterparties',
    imgSrc:
      'https://app.termgrid.com/wp-content/uploads/2021/12/fee-tracker.jpg',
  },
];

const adminFeatures = [
  {
    title: 'One time password',
    description: 'Securely share files with your counterparties',
    imgSrc: otp,
  },
  {
    title: 'Multi-wallet connection',
    description:
      'Access a complete ecommerce platform with simple, pay-as-you-go pricing. 1% fee per transaction.',
    imgSrc: multiWallet,
  },
  {
    title: 'In-app NFT creation',
    description:
      'Access a complete ecommerce platform with simple, pay-as-you-go pricing. 1% fee per transaction.',
    imgSrc: nftCreation,
  },
];

export const authFeatures = {
  title: 'Authentication',
  description:
    'Accelerate deal execution Optimize transaction costs Save professional time.',
  features: adminFeatures,
};

export const featuresList = [
  authFeatures,
  {
    title: 'Web3 marketing tools',
    description:
      'Accelerate deal execution Optimize transaction costs Save professional time.',
    features: engagementFeatures,
  },
  {
    title: 'Payments',
    description:
      'Accelerate deal execution Optimize transaction costs Save professional time Streamline collaboration with advisors.',
    features: paymentFeatures,
  },
];
