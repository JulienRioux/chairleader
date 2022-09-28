import styled from 'styled-components';

export const TextareaWrapper = styled.textarea`
  border: ${(p) => p.theme.borderWidth} solid ${(p) => p.theme.color.text};
  color: ${(p) => p.theme.color.text};
  background: transparent;
  font-size: 16px;
  width: -webkit-fill-available;
  padding: 8px 12px;
  margin-bottom: 8px;
  transition: 0.2s;
  border-radius: ${(p) => p.theme.borderRadius.input};
  resize: none;

  :focus {
    outline: none;
    border-color: ${(p) => p.theme.color.primary};
  }
`;

export const Label = styled.label`
  color: ${(p) => p.theme.color.text};
  display: inline-block;
  margin: 8px 0 4px 0;
`;
