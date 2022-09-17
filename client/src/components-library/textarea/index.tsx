import { RequiredWrapper } from 'components-library/input/input.styles';
import * as React from 'react';
import { TextareaWrapper, Label } from './input.styles';
import { TextareaProps } from './types';

export const Textarea = ({ label, ...props }: TextareaProps) => (
  <>
    {label && (
      <Label htmlFor={props.id}>
        {label} {props.required && <RequiredWrapper>*</RequiredWrapper>}
      </Label>
    )}
    <TextareaWrapper rows={5} {...props} />
  </>
);
