import { UnstyledButton } from 'components-library';
import styled, { css } from 'styled-components';
import { Styles } from 'styles';
import { fadeIn, fadeOut, modalIn } from 'utils/keyframes';

// TODO: Put this in the Styles object
const MODAL_SIDE_MARGIN = '8px';
const MODAL_ANIM_TIME = `${Styles.components.modal.animationDuration - 150}ms`;
const MODAL_CONTAINER_ANIM_TIME = `${Styles.components.modal.animationDuration}ms`;

export const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${(p) => p.theme.zIndex.max};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalWrapperBackground = styled.div<{ isClosing: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${(p) => p.theme.color.backdrop};
  animation: ${({ isClosing }) =>
    isClosing
      ? css`
          ${MODAL_ANIM_TIME} ${fadeOut} forwards;
        `
      : css`
          ${MODAL_ANIM_TIME} ${fadeIn} forwards
        `};
`;

export const ModalContainer = styled.div<{
  isClosing: boolean;
  isFullScreenImg?: boolean;
}>`
  /* margin: ${MODAL_SIDE_MARGIN}; */
  max-height: calc(
    100vh - ${MODAL_SIDE_MARGIN} - ${MODAL_SIDE_MARGIN} -
      env(safe-area-inset-top) - env(safe-area-inset-bottom)
  );
  /* margin: 10px ${MODAL_SIDE_MARGIN} 80px; */
  width: 100%;
  max-width: calc(
    ${(p) => p.theme.layout.mediumWidth} - ${MODAL_SIDE_MARGIN} -
      ${MODAL_SIDE_MARGIN}
  );
  min-height: 220px;
  background-color: ${(p) => p.theme.color.background};
  z-index: ${(p) => p.theme.zIndex.max};
  position: relative;
  overflow: scroll;
  margin: 8px;
  border-radius: ${(p) => p.theme.borderRadius.default};

  animation: ${({ isClosing }) =>
    isClosing
      ? css`
          ${MODAL_CONTAINER_ANIM_TIME} ${modalIn} reverse forwards;
        `
      : css`
          ${MODAL_CONTAINER_ANIM_TIME} ${modalIn} forwards;
        `};
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${MODAL_SIDE_MARGIN};
  font-size: 16px;
  position: sticky;
  top: 0;
  z-index: 9;
  background: ${(p) => p.theme.color.background};
  border-bottom: 1px solid ${(p) => p.theme.color.lightText};
`;

const CLOSE_BUTTON_SIZE = '32px';

export const CloseBtn = styled(UnstyledButton)`
  font-size: 20px;
  height: ${CLOSE_BUTTON_SIZE};
  min-height: ${CLOSE_BUTTON_SIZE};
  width: ${CLOSE_BUTTON_SIZE};
  min-width: ${CLOSE_BUTTON_SIZE};
  color: ${(p) => p.theme.text};
  background: ${(p) => p.theme.text}22;
  border-radius: ${(p) => p.theme.borderRadius.default};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s;

  :hover {
    background: ${(p) => p.theme.color.text}11;
  }
`;

export const ContentWrapper = styled.div`
  padding: 8px ${MODAL_SIDE_MARGIN};
`;

export const ModalTitle = styled.div`
  padding: 12px 0;
  font-size: 20px;
  font-weight: bold;
`;
