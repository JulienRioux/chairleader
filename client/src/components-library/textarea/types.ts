import { InputHTMLAttributes } from 'react';

export interface TextareaProps
  extends Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'label' | 'rows'> {
  label?: string;
  rows?: number;
}
