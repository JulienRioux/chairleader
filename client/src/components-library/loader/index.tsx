import styled from 'styled-components';
import { spin } from 'utils/keyframes';

export const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InnerLoader = styled.div`
  border: 4px solid ${(p) => p.theme.color.primary};
  border-right-color: transparent;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  animation: 1.6s ${spin} linear infinite;
  margin: 40px 20px;
`;

export const Loader = () => (
  <LoaderWrapper>
    <InnerLoader />
  </LoaderWrapper>
);
