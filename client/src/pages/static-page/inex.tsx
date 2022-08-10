import { HalfImagePageLayout } from 'pages/auth-page';
import * as React from 'react';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const StaticPageWrapper = styled.div``;

const Title = styled.h1`
  @media (max-width: 800px) {
    margin: 16px 0 40px 80px;
  }
`;

const Par = styled.p`
  line-height: 1.7;
`;

const FAKE_CONTENT = 'Coming soon...';

const staticPageContentMap = {
  privacy: {
    title: 'Privacy policy',
    content: FAKE_CONTENT,
  },
  ['terms-of-service']: {
    title: 'Terms of services',
    content: FAKE_CONTENT,
  },
};

export const StaticPage: FC = () => {
  const { staticPage } = useParams();

  const { title, content } =
    staticPageContentMap[staticPage as keyof typeof staticPageContentMap];

  return (
    <HalfImagePageLayout>
      <StaticPageWrapper>
        <Title>{title}</Title>

        <Par>{content}</Par>
      </StaticPageWrapper>
    </HalfImagePageLayout>
  );
};
