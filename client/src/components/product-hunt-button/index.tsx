import styled from 'styled-components';

const ProductHuntBtnLink = styled.a`
  display: flex;
`;

const ProductHuntFooterBtn = styled.div`
  display: flex;
  align-items: center;
  margin: 28px 0 0;
`;

export const ProductHuntBtnOnly = () => (
  <ProductHuntFooterBtn>
    <ProductHuntBtnLink
      href="https://www.producthunt.com/posts/gouache?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-gouache"
      target="_blank"
      rel="noreferrer"
    >
      <img
        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=339303&theme=light"
        alt="Gouache - Enhance&#0032;your&#0032;design&#0032;to&#0032;production&#0032;workflow&#0046; | Product Hunt"
        style={{ height: '54px', width: '250px' }}
      />
    </ProductHuntBtnLink>
  </ProductHuntFooterBtn>
);
