import { Icon } from 'components-library';
import styled from 'styled-components';
import { useStoreLink } from '../point-of-sale-page';
import { useState, useEffect } from 'react';

const FakeChrome = styled.div`
  width: 393px;
  min-width: 393px;
  border-radius: 32px;
  box-shadow: 0 20px 44px rgb(50 50 93 / 12%), 0 -1px 32px rgb(50 50 93 / 6%),
    0 3px 12px rgb(0 0 0 / 8%), inset 0 -2px 5px rgb(10 37 64 / 35%);

  background: #fff;

  /* box-shadow: 0 20px 44px rgb(50 50 93 / 12%), 0 -1px 32px rgb(50 50 93 / 6%),
    0 3px 12px rgb(0 0 0 / 8%), inset 0 -2px 5px rgb(10 37 64 / 35%); */

  padding: 8px;
  margin: 0 auto;
  height: 871px;
  min-height: 871px;
  overflow: hidden;
`;

const FakeChromeWrapper = styled.div`
  box-shadow: 0 0 2px rgb(10 37 64 / 33%);
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  overflow: hidden;
`;

const FakeChromeTopBar = styled.div`
  background: #fcfeff;
  box-shadow: 0 0.5px 0 #ecf2f7;
  padding: 6px 24px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
`;

const FakeChromeUrlBar = styled.div`
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  background: rgba(236, 242, 247, 0.4);
  border-radius: 12px;
  font-weight: 600;
  font-size: 8px;
  line-height: 12px;
  color: #0a2540;
  width: 615px;
  height: 20px;
`;

const FakeChromeContent = styled.div`
  position: relative;
  height: 100%;
`;

const Iframe = styled.iframe`
  height: 100%;
  width: 100%;
  border: none;
  /* pointer-events: none; */
`;

const HomepagePreviewWrapper = styled.div`
  position: sticky;
  top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const HomepagePreviewBackground = styled.div`
  width: 100%;
`;

export const PreviewChange = ({
  storeName = '',
  title = '',
  subTitle = '',
  logoImgSrc = '',
  homepageImgSrc = '',
  themeColor = '',
  borderRadius = '',
}) => {
  const storeLink = useStoreLink();

  const [iframeUrl, setIframeUrl] = useState(storeLink);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const newUrl = `${storeLink}/inventory/?homepage_title=${title}&homepage_sub_title=${subTitle}&homepage_hero_img=${homepageImgSrc}&override_theme_color=${themeColor}&preview_store_name=${storeName}&preview_store_logo=${logoImgSrc}&override_border_radius=${borderRadius}&override-hide-app=true`;

      if (newUrl !== iframeUrl) {
        setIframeUrl(newUrl);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [
    homepageImgSrc,
    iframeUrl,
    logoImgSrc,
    storeLink,
    storeName,
    subTitle,
    themeColor,
    title,
    borderRadius,
  ]);

  return (
    <HomepagePreviewBackground>
      <HomepagePreviewWrapper>
        <FakeChrome>
          <FakeChromeWrapper>
            <FakeChromeTopBar>
              <FakeChromeUrlBar>
                <Icon name="lock" />
                <span style={{ marginLeft: '4px', fontWeight: 'normal' }}>
                  {storeLink}
                </span>
              </FakeChromeUrlBar>
            </FakeChromeTopBar>
            <FakeChromeContent>
              <Iframe id="preview_iframe" src={iframeUrl} />
            </FakeChromeContent>
          </FakeChromeWrapper>
        </FakeChrome>
      </HomepagePreviewWrapper>
    </HomepagePreviewBackground>
  );
};
