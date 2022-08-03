import { ReactNode } from 'react';

export interface IModalProps {
  onClose: () => void;
  isClosing: boolean;
  children?: ReactNode;
  title?: ReactNode;
}

export interface IFullPageImage {
  onClose: () => void;
  isClosing: boolean;
  src: string;
}
