import React, { FC } from 'react';
import styled from 'styled-components';
import { SolanaPayLogo } from './SolanaPayLogo';

const PoweredBySolanaPayWrapper = styled.div`
  display: flex;
  margin: 0 8px;
  justify-content: center;
  align-items: center;
  font-weight: bold;
`;

export const PoweredBySolanaPay: FC = () => {
  return (
    <PoweredBySolanaPayWrapper>
      <span style={{ marginRight: '12px' }}>Powered by</span>
      <SolanaPayLogo />
    </PoweredBySolanaPayWrapper>
  );
};
