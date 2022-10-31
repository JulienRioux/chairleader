import { ProductHuntBtnOnly } from 'components/product-hunt-button';
import { Icon, UnstyledExternalLink } from 'components-library';
import { SHOW_PRODUCT_HUNT_BTN, APP_NAME } from 'configs';
import * as React from 'react';
import { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from 'utils';

import {
  ColumnTitle,
  ColumnWrapper,
  CopyrightPar,
  FooterLink,
  FooterWrapper,
  InnerFooterWrapper,
  FooterInnerWrapper,
  BottomFooter,
} from './styled';

const SolanaLogo = () => (
  <svg width="31" height="27" viewBox="0 0 31 27" fill="none">
    <path
      d="m30.179 21.3-5.008 5.332a1.143 1.143 0 0 1-.848.368H.583a.59.59 0 0 1-.535-.348.568.568 0 0 1-.04-.328.593.593 0 0 1 .148-.298l5.002-5.332a1.141 1.141 0 0 1 .848-.368h23.74a.574.574 0 0 1 .43.971l.003.003ZM25.17 10.56a1.192 1.192 0 0 0-.848-.368H.583a.59.59 0 0 0-.535.349.569.569 0 0 0-.04.328c.02.112.071.213.148.297l5.002 5.335c.107.115.24.208.384.27.147.064.303.095.464.098h23.74a.574.574 0 0 0 .529-.348.569.569 0 0 0-.108-.623l-5-5.335.003-.003ZM.582 6.73h23.74a1.2 1.2 0 0 0 .464-.096c.147-.064.277-.154.384-.272L30.18 1.03a.579.579 0 0 0-.107-.881.571.571 0 0 0-.323-.09H6.006c-.158 0-.317.034-.464.095a1.126 1.126 0 0 0-.384.273L.156 5.759a.582.582 0 0 0-.108.625.59.59 0 0 0 .534.348V6.73Z"
      fill="url(#a)"
    ></path>
    <defs>
      <linearGradient
        id="a"
        x1="2.561"
        y1="27.642"
        x2="27.258"
        y2="-.397"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".08" stopColor="#9945FF"></stop>
        <stop offset=".3" stopColor="#8752F3"></stop>
        <stop offset=".5" stopColor="#5497D5"></stop>
        <stop offset=".6" stopColor="#43B4CA"></stop>
        <stop offset=".72" stopColor="#28E0B9"></stop>
        <stop offset=".97" stopColor="#19FB9B"></stop>
      </linearGradient>
    </defs>
  </svg>
);

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

interface IFooterItem {
  title: string;
  to?: string;
  href?: string;
}

const footerData = [
  {
    content: [
      { title: 'Home', to: routes.base },
      { title: 'Pricing', to: routes.pricing },
      { title: 'Features', to: routes.features },
      { title: 'NFTs', to: routes.mintNft },
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

export const Footer: FC = () => {
  return (
    <FooterWrapper>
      <FooterInnerWrapper>
        <InnerFooterWrapper>
          {footerData.map(({ title, content }) => (
            <ColumnWrapper key={title}>
              <ColumnTitle>{title}</ColumnTitle>
              {content.map(({ title: contentTitle, to, href }: IFooterItem) =>
                to ? (
                  <FooterLink to={to} key={contentTitle}>
                    {contentTitle}
                  </FooterLink>
                ) : (
                  <FooterLink
                    as="a"
                    href={href}
                    target="_blank"
                    key={contentTitle}
                  >
                    {contentTitle}
                    <Icon name="launch" style={{ paddingLeft: '8px' }} />
                  </FooterLink>
                )
              )}
            </ColumnWrapper>
          ))}
        </InnerFooterWrapper>

        {SHOW_PRODUCT_HUNT_BTN && <ProductHuntBtnOnly />}

        <BottomFooter>
          <CopyrightPar>
            Copyright © {new Date().getFullYear()} {APP_NAME}
          </CopyrightPar>

          <UnstyledExternalLink href="https://solana.com/" target="_blank">
            <CopyrightPar>
              Powered by <SolanaLogo /> Solana
            </CopyrightPar>
          </UnstyledExternalLink>
        </BottomFooter>
      </FooterInnerWrapper>
    </FooterWrapper>
  );
};
