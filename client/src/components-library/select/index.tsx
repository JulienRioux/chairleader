import { FC } from 'react';
import { Icon } from 'components-library/icon';
import * as React from 'react';
import { Label } from 'components-library/input/input.styles';
import {
  ChevronWrapper,
  SelectInnerWrapper,
  SelectInput,
  SelectWrapper,
} from './select.styles';
import { ISelectProps } from './types';

export const Select: FC<ISelectProps> = ({
  onChange,
  name,
  value,
  options,
  placeholder,
  label,
  id,
  required,
  disabled,
}) => {
  const selectOptions = [
    { disabled: true, label: placeholder ?? '', value: '' },
    ...options,
  ];

  return (
    <SelectWrapper>
      {label && (
        <>
          <Label htmlFor={id}>{label}</Label>
        </>
      )}

      <SelectInnerWrapper>
        <SelectInput
          id={id}
          onChange={onChange}
          value={value}
          name={name}
          required={required}
          disabled={disabled}
        >
          {selectOptions.map(
            ({
              value: optionValue,
              label: optionLabel,
              disabled: optionDisabled,
            }) => (
              <option
                value={optionValue}
                key={optionValue}
                disabled={!optionValue || optionDisabled}
              >
                {optionLabel}
              </option>
            )
          )}
        </SelectInput>

        <ChevronWrapper>
          <Icon name="arrow_downward" />
        </ChevronWrapper>
      </SelectInnerWrapper>
    </SelectWrapper>
  );
};
