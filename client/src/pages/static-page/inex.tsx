import { Button } from 'components-library';
import { HomepageTopNav } from 'pages/homepage';
import * as React from 'react';
import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const StaticPageWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
`;

const TitleAndBackBtn = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Par = styled.p`
  line-height: 1.7;
`;

const FAKE_CONTENT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

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
  const navigate = useNavigate();
  const { staticPage } = useParams();

  const { title, content } =
    staticPageContentMap[staticPage as keyof typeof staticPageContentMap];

  return (
    <>
      <HomepageTopNav />
      <StaticPageWrapper>
        <TitleAndBackBtn>
          <h1>{title}</h1>
          <Button secondary icon="west" onClick={() => navigate(-1)} />
        </TitleAndBackBtn>

        <Par>{content}</Par>
      </StaticPageWrapper>
    </>
  );
};
