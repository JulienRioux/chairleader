import * as React from 'react';
import { FC } from 'react';
import { VisuallyHiddenInput } from '..';
import { ICheckboxProps } from './types';
import {
  CheckboxWrapper,
  CheckboxText,
  CheckboxUi,
  CheckMark,
  Label,
} from './styled';

const CheckmarkSvg = () => (
  <svg
    width="13px"
    height="11px"
    viewBox="0 0 13 11"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <g
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
    >
      <path
        d="M1.54315779,5.29864252 L4.37941608,8.69736768 C4.73327366,9.12139982 5.36387788,9.17828753 5.78791001,8.82442995 C5.84721333,8.77494094 5.90058323,8.71874775 5.94695224,8.65697429 L11.3441712,1.46672288 L11.3441712,1.46672288"
        id="Path"
        stroke="#fff"
        strokeWidth="2"
      />
    </g>
  </svg>
);

export const Checkbox: FC<ICheckboxProps> = ({
  id,
  label,
  onChange,
  checked,
  fullWidth,
  disabled,
}) => {
  return (
    <CheckboxWrapper>
      <Label htmlFor={id} $fullWidth={fullWidth} disabled={disabled}>
        <VisuallyHiddenInput
          type="checkbox"
          id={id}
          name={id}
          onChange={onChange}
          checked={checked}
          disabled={disabled}
        />
        <CheckboxUi checked={checked} disabled={disabled}>
          <CheckMark checked={checked}>
            <CheckmarkSvg />
          </CheckMark>{' '}
        </CheckboxUi>
        <CheckboxText disabled={disabled}>{label}</CheckboxText>
      </Label>
    </CheckboxWrapper>
  );
};
