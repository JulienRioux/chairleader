import {
  Button,
  UnstyledButton,
  UnstyledExternalLink,
} from 'components-library';
import styled from 'styled-components';

export const NftImg = styled.img`
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 1px solid ${(p) => p.theme.color.text}22;
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: 400px;
  background: ${(p) => p.theme.color.black}11;
`;

export const NftName = styled.div`
  font-weight: bold;
  margin: 4px 0;
  font-size: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const SolScanLink = styled(UnstyledExternalLink)`
  margin-bottom: 8px;
  padding: 4px;
  color: ${(p) => p.theme.color.primary};
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 2px solid ${(p) => p.theme.color.primary}22;
  display: inline-block;
`;

export const EditionNumber = styled.span`
  margin-left: 8px;
  color: ${(p) => p.theme.color.lightText};
`;

export const Description = styled.p`
  color: ${(p) => p.theme.color.lightText};
`;

export const DetailsWrapper = styled.div`
  width: 100%;
`;

export const TokenGatingNftWrapper = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 60px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const TokenGateTypeTitle = styled.h3`
  margin: 0;
  font-size: 24px;
`;

export const StyledButton = styled(Button)`
  font-size: 14px;
  padding: 8px 12px;
  margin-left: 20px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  justify-content: space-between;
`;

export const ProductImg = styled.img`
  width: 100%;
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 1px solid ${(p) => p.theme.color.text}22;
  aspect-ratio: 1 / 1;
`;

export const Scoller = styled.div`
  display: flex;
  gap: 20px;
  overflow: scroll;
  padding: 12px 0;
  border-top: 1px solid ${(p) => p.theme.color.text}22;
`;

export const DealsWrapper = styled.div`
  overflow: scroll;
  margin-bottom: 80px;
`;

export const DealTitle = styled.h4`
  margin: 8px 0 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const DealPrice = styled.div`
  margin: 8px 0 0;
  color: ${(p) => p.theme.color.primary};
`;

export const DealItemButton = styled.div`
  min-width: 200px;
  width: 200px;
  text-align: left;
`;

export const RightWrapper = styled.div`
  overflow: scroll;
`;
