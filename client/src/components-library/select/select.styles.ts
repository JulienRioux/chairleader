import styled from 'styled-components';

export const SelectWrapper = styled.div`
  margin-bottom: 12px;
`;

export const SelectInput = styled.select`
  transition: 0.2s;
  cursor: pointer;
  background-color: transparent;
  border-radius: ${(p) => p.theme.borderRadius.input};
  font-size: 16px;
  padding: 12px;
  appearance: none;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  color: ${(p) => p.theme.color.text};
  min-width: 220px;
  border: ${(p) => p.theme.borderWidth} solid ${(p) => p.theme.color.text}66;

  &:focus,
  &:active {
    outline: none;
  }

  :focus {
    border-color: ${(p) => p.theme.color.primary};
  }

  :invalid {
    color: #757575;
  }
`;

export const SelectInnerWrapper = styled.div`
  position: relative;
`;

export const ChevronWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 8px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  pointer-events: none;
  color: ${(p) => p.theme.color.text};
`;
