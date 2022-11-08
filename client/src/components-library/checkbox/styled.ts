import { UnstyledButton } from 'components-library';
import styled, { css } from 'styled-components';

export const CheckboxWrapper = styled.div`
  margin-bottom: 16px;
`;

export const CheckboxText = styled.div<{ disabled?: boolean }>`
  margin-left: 8px;
  cursor: pointer;
  ${(p) =>
    p.disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}
`;

const CHECKBOX_SIZE = '22px';

const CHECKED_STYLE = css`
  background-color: ${(p) => p.theme.color.primary};
  border-color: ${(p) => p.theme.color.primary};
`;

export const CheckboxUi = styled(UnstyledButton)<{
  checked: boolean;
  disabled?: boolean;
}>`
  height: ${CHECKBOX_SIZE};
  width: ${CHECKBOX_SIZE};
  border-radius: ${(p) => p.theme.borderRadius.input};
  border: 1px solid ${(p) => p.theme.color.text}66;
  ${(p) => p.checked && CHECKED_STYLE}
  transition: 0.2s;
  pointer-events: none;

  ${(p) =>
    p.disabled &&
    css`
      background: ${(p) => p.theme.color.lightGrey};
      border-color: ${(p) => p.theme.color.lightGrey};
    `}
`;

const CHECKMARK_CHECKED_STYLE = css`
  opacity: 1;
  svg {
    transform: scale(1);
  }
`;

export const CheckMark = styled.span<{ checked: boolean }>`
  transition: 0.2s;
  opacity: 0;
  svg {
    transition: 0.2s;
    transition-timing-function: ease-in;
    transform: scale(0.6);
  }
  ${(p) => p.checked && CHECKMARK_CHECKED_STYLE}
`;

export const Label = styled.label<{ $fullWidth?: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: ${(p) => (p.$fullWidth ? `100%;` : `fit-content`)};
  ${(p) => p.disabled && '    cursor: not-allowed;'};
`;
