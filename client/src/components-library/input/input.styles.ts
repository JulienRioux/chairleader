import styled from 'styled-components';
import { Styles } from 'styles';

export const InputWrapper = styled.input`
  border: ${(p) => p.theme.borderWidth} solid ${(p) => p.theme.color.text};
  color: ${(p) => p.theme.color.text};
  background: transparent;
  font-size: 16px;
  width: -webkit-fill-available;
  padding: 12px;
  margin-bottom: 12px;
  transition: 0.2s;
  border-radius: ${(p) => p.theme.borderRadius.input};

  :focus {
    outline: none;
    border-color: ${(p) => p.theme.color.primary};
  }

  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  :disabled {
    background: ${(p) => p.theme.color.lightGrey};
    border: ${(p) => p.theme.color.lightText};
  }
`;

export const Label = styled.label`
  color: ${(p) => p.theme.color.text};
  display: inline-block;
  margin: 8px 0 4px 0;
`;

export const Error = styled.div`
  color: ${(p) => p.theme.color.danger};
  font-size: 14px;
  margin-bottom: 12px;
  font-weight: bold;
`;

export const RequiredWrapper = styled.span`
  font-weight: normal;
  color: ${(p) => p.theme.color.text}cc;
`;
