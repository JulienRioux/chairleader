import { UnstyledLink } from 'components-library';
import styled from 'styled-components';
import { Styles } from 'styles';

export const FooterWrapper = styled.div`
  padding: 40px 0 20px;
  border-top: 1px solid ${(p) => p.theme.color.lightGrey};
`;

export const FooterInnerWrapper = styled.div`
  max-width: ${(p) => p.theme.layout.maxWidth};
  margin: 0 auto;
`;

export const InnerFooterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

export const ColumnWrapper = styled.div`
  width: 25%;

  @media (max-width: 600px) {
    width: 100%;
    margin-bottom: 40px;

    :last-child {
      margin-bottom: 0;
    }
  }
`;

export const ColumnTitle = styled.div`
  font-weight: bold;
  padding-bottom: 20px;
`;

export const FooterLink = styled(UnstyledLink)`
  text-decoration: none;
  display: block;
  padding-bottom: 12px;
  cursor: pointer;
  width: fit-content;
  white-space: nowrap;

  :hover {
    text-decoration: underline;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const CopyrightPar = styled.p`
  margin: 0;
  padding: 40px 0 0 0;
  color: ${(p) => p.theme.color.lightText};

  @media (max-width: 600px) {
    text-align: center;
  }
`;

export const BottomFooter = styled.div`
  display: flex;
  justify-content: space-between;

  svg {
    height: 16px;
    width: 16px;
  }

  @media (max-width: 600px) {
    display: block;
  }
`;
