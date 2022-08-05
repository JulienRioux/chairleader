import { ProductHuntBtnOnly } from 'components/product-hunt-button';
import { Icon } from 'components-library';
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
} from './styled';

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
      { title: 'Pricing', to: routes.pricing },
      { title: 'Authenticate', to: routes.auth },
    ],
    title: 'Product',
  },
  {
    content: [
      {
        href: 'mailto:julien.rioux@toptal.com',
        title: 'Investors',
      },
      { href: 'mailto:julien.rioux@toptal.com', title: 'Contact' },
      {
        href: 'https://chairleader.canny.io/',
        title: 'Send feedback',
      },
    ],
    title: 'More',
  },
  {
    content: [
      { title: 'Privacy policy', to: routes.static.privacy },
      { title: 'Terms of service', to: routes.static.termsOfService },
    ],
    title: 'Legal',
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

        <CopyrightPar>
          Copyright © {new Date().getFullYear()} {APP_NAME}
        </CopyrightPar>
      </FooterInnerWrapper>
    </FooterWrapper>
  );
};
