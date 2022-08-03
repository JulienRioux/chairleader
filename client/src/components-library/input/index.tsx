import * as React from 'react';
import { InputWrapper, Label, Error } from './input.styles';
import { InputProps } from './types';

export const Input = ({ label, error, ...props }: InputProps) => (
  <>
    {label && <Label htmlFor={props.id}>{label}</Label>}
    <InputWrapper {...props} />
    {error && <Error>{error}</Error>}
  </>
);
