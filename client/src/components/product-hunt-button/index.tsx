import styled from 'styled-components';

const ProductHuntBtnLink = styled.a`
  display: flex;

  :active {
    transform: translateY(3px);
  }
`;

const ProductHuntFooterBtn = styled.div`
  display: flex;
  align-items: center;
  margin: 28px 0 0;

  @media (max-width: 800px) {
    justify-content: center;
  }
`;

export const ProductHuntBtnOnly = () => (
  <ProductHuntFooterBtn>
    <ProductHuntBtnLink
      href="https://www.producthunt.com/posts/chairleader?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-chairleader"
      target="_blank"
      rel="noreferrer"
    >
      <img
        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=369492&theme=neutral"
        alt="Chairleader - The&#0032;most&#0032;advanced&#0032;no&#0045;code&#0032;web3&#0032;eCommerce&#0032;platform&#0032;ever&#0032;built | Product Hunt"
        style={{ height: '54px', width: '250px' }}
        width="250"
        height="54"
      />
    </ProductHuntBtnLink>
  </ProductHuntFooterBtn>
);
