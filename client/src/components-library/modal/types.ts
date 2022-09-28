import { ReactNode } from 'react';

export interface IModalProps {
  onClose: () => void;
  isClosing: boolean;
  children?: ReactNode;
  title?: ReactNode;
  isMaxWidth?: boolean;
}

export interface IFullPageImage {
  onClose: () => void;
  isClosing: boolean;
  src: string;
}
