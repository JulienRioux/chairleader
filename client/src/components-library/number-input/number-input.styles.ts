import { UnstyledButton } from 'components-library/button';
import styled from 'styled-components';

export const NumberInputWrapper = styled.div``;

export const NumberBtn = styled(UnstyledButton)`
  border: 2px solid ${(p) => p.theme.color.primary};
  border-radius: 50%;
  padding: 4px;
  color: ${(p) => p.theme.color.primary};
  transition: 0.2s;

  :disabled {
    color: ${(p) => p.theme.color.text};
    border-color: ${(p) => p.theme.color.text};
    opacity: 0.2;
    cursor: not-allowed;
  }
`;

export const ValueWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  padding: 4px;
`;
