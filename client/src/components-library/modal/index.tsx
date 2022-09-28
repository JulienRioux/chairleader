import * as React from 'react';
import { FC, useState, useCallback, useEffect } from 'react';
import { Styles } from 'styles';
import { IModalProps } from './types';
import {
  ModalWrapper,
  ModalContainer,
  CloseBtn,
  ModalWrapperBackground,
  ModalTitle,
  ContentWrapper,
  ModalHeader,
} from './styled';
import { Icon } from 'components-library';

// Getting the animation duration from the Styles object to keep consistent with the UI
const {
  components: {
    modal: { animationDuration },
  },
} = Styles;

/**
 * Modal description:
 * This is a simple modal component.
 */
const ModalComponent = ({
  onClose,
  isClosing,
  children,
  title,
  isMaxWidth,
}: IModalProps) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    // Stop scrolling when the modal open
    document.body.style.overflow = 'hidden';

    // Cleanup the body overflow style on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <ModalWrapper>
      <ModalWrapperBackground onClick={handleClose} isClosing={isClosing} />

      <ModalContainer isClosing={isClosing} isMaxWidth={isMaxWidth}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>

          <CloseBtn onClick={onClose} hasAnimation>
            <Icon name="close" />
          </CloseBtn>
        </ModalHeader>
        <ContentWrapper>{children}</ContentWrapper>
      </ModalContainer>
    </ModalWrapper>
  );
};

interface IUseModal {
  onClose?: () => void;
}

/**
 * useModal hook description:
 * This is a simple modal hook to display modals.
 */
export const useModal = (useModalPropsObj?: IUseModal) => {
  const onClose = useModalPropsObj?.onClose;
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (onClose) {
      onClose();
    }
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      // Restart scrolling when the modal close
      document.body.style.overflow = 'unset';
    }, animationDuration);
    setIsClosing(true);
  }, [onClose]);

  /**  Modal component */
  const Modal: FC<{
    children?: React.ReactNode;
    title?: string;
    hasTitleBorder?: boolean;
    hasTitleBottomMargin?: boolean;
    isMaxWidth?: boolean;
  }> = useCallback(
    ({ children, title, isMaxWidth }) => (
      <>
        {isOpen && (
          <ModalComponent
            title={title}
            onClose={closeModal}
            isClosing={isClosing}
            isMaxWidth={isMaxWidth}
          >
            {children}
          </ModalComponent>
        )}
      </>
    ),
    [closeModal, isClosing, isOpen]
  );

  return {
    Modal,
    closeModal,
    openModal,
  };
};
