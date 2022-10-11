import { Button } from 'components-library/button';
import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

const Options = styled.div`
  margin-top: 4px;
  display: flex;
  gap: 8px;
`;

const SelectButtonLabel = styled.label`
  color: ${(p) => p.theme.color.text};
  display: inline-block;
  margin: 8px 0 4px 0;
  font-size: 14px;
`;

const SelectButton = styled(Button)<{ $isActive: boolean }>`
  min-width: 60px;
  font-weight: normal;

  ${(p) =>
    p.$isActive &&
    css`
      /* border-color: ${p.theme.color.primary} !important;
      background-color: ${p.theme.color.primary}11; */
      border-color: transparent;
      background-color: ${p.theme.color.primary}22;
      /* color: ${p.theme.color.buttonText}; */
    `}

  :disabled {
    opacity: 0.4;
  }
`;

const SelectButtonsWrapper = styled.div`
  margin-bottom: 8px;
`;

export const SelectButtons = ({
  label,
  options,
  value,
  onChange,
  checkIfOptionIsOutOfStock,
}: {
  label: ReactNode;
  options: string[];
  value: string;
  onChange: (option: string) => void;
  checkIfOptionIsOutOfStock: (option: string) => void;
}) => {
  return (
    <SelectButtonsWrapper>
      <SelectButtonLabel>{label}</SelectButtonLabel>
      <Options>
        {options.map((option) => (
          <SelectButton
            key={option}
            secondary
            $isActive={option === value}
            onClick={() => onChange(option)}
            disabled={checkIfOptionIsOutOfStock(option)}
          >
            {option}
          </SelectButton>
        ))}
      </Options>
    </SelectButtonsWrapper>
  );
};
