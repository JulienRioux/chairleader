import { HalfImagePageLayout } from 'pages/auth-page';
import * as React from 'react';
import styled from 'styled-components';
import BlockContent from '@sanity/block-content-to-react';
import { sanityClient } from 'cms';
import { FC, useCallback, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Logger } from 'utils';
import { Loader } from 'components-library';

const getSanityQuery = (queryName: string) => `
*[_type == '${queryName}']{
  title,
  text
}[0]
`;

const StaticPageWrapper = styled.div``;

const Title = styled.h1`
  @media (max-width: 800px) {
    margin: 16px 0 40px 80px;
  }
`;

export const BlockContentWrapper = styled.div`
  h4 {
    font-size: 24px;
  }
`;

const Par = styled.p`
  line-height: 1.7;
`;

export const StaticPage: FC = () => {
  const { staticPage } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [text, setText] = useState<any>(null);
  const [fetchingDataError, setFetchingDataError] = useState(false);

  const loadStaticPageData = useCallback(async () => {
    const locale = 'en';
    try {
      const staticPageData = await sanityClient.fetch(
        getSanityQuery(staticPage ?? '')
      );
      console.log('staticPageData', staticPageData);
      setTitle(staticPageData.title[locale]);
      setText(staticPageData.text[locale]);
      setIsLoading(false);
    } catch (err) {
      Logger.error(err);
      setIsLoading(false);
      setFetchingDataError(true);
    }
  }, [staticPage]);

  useEffect(() => {
    loadStaticPageData();
  }, [loadStaticPageData]);

  if (fetchingDataError) {
    return <Navigate to="/something-went-wrong" />;
  }

  return (
    <HalfImagePageLayout>
      {isLoading ? (
        <Loader />
      ) : (
        <StaticPageWrapper>
          <Title>{title}</Title>

          <BlockContentWrapper>
            <Par>
              <BlockContent blocks={text} />
            </Par>
          </BlockContentWrapper>
        </StaticPageWrapper>
      )}
    </HalfImagePageLayout>
  );
};
