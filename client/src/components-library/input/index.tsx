import * as React from 'react';
import { InputWrapper, Label, Error, RequiredWrapper } from './input.styles';
import { InputProps } from './types';

export const Input = ({ label, error, ...props }: InputProps) => (
  <>
    {label && (
      <Label htmlFor={props.id}>
        {label} {props.required && <RequiredWrapper>*</RequiredWrapper>}
      </Label>
    )}
    <InputWrapper {...props} />
    {error && <Error>{error}</Error>}
  </>
);
