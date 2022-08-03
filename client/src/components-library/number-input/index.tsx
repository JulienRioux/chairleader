import { Icon } from 'components-library/icon';
import React, { useCallback } from 'react';
import {
  NumberInputWrapper,
  NumberBtn,
  ValueWrapper,
} from './number-input.styles';

export const NumberInput = ({
  value,
  onChange,
  min = 1,
  max = 10,
}: {
  value: number;
  onChange: any;
  min?: number;
  max?: number;
}) => {
  const handleMinus = useCallback(() => {
    onChange(value - 1);
  }, [onChange, value]);

  const handlePlus = useCallback(() => {
    onChange(value + 1);
  }, [onChange, value]);

  return (
    <NumberInputWrapper>
      <NumberBtn disabled={value <= min} onClick={handleMinus}>
        <Icon name="remove" />
      </NumberBtn>
      <ValueWrapper>{value}</ValueWrapper>
      <NumberBtn disabled={value >= max} onClick={handlePlus}>
        <Icon name="add" />
      </NumberBtn>
    </NumberInputWrapper>
  );
};
