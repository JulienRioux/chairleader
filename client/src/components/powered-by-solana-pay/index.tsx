import React, { FC } from 'react';
import styled from 'styled-components';
import { SolanaPayLogo } from './SolanaPayLogo';

const PoweredBySolanaPayWrapper = styled.div`
  display: flex;
  margin: 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  line-height: 48px;
  font-weight: 500;
`;

export const PoweredBySolanaPay: FC = () => {
  return (
    <PoweredBySolanaPayWrapper>
      Powered by <SolanaPayLogo />
    </PoweredBySolanaPayWrapper>
  );
};
