import styled from 'styled-components';
import { messageIn, messageOut } from 'utils/keyframes';
import { RefObject } from 'react';

export const ANIMATION_DURATION = 0.2;

export const MessageWrapper = styled.div<{
  time: number;
  ref: RefObject<HTMLDivElement>;
  height: number;
}>`
  padding: 8px;
  min-height: 32px;
  background: ${(p) => p.theme.color.background}88;
  border: 1px solid ${(p) => p.theme.color.text}44;
  color: ${(p) => p.theme.color.text};
  display: flex;
  align-items: center;
  line-height: 1.5;
  position: relative;
  width: 400px;
  /* (padding: 8px * 2) + (position: 8px left and 8px right) + (border: 1px * 2) */
  max-width: calc(100vw - 34px);
  margin: 0 auto 8px;
  display: flex;
  animation-fill-mode: forwards;
  animation-name: ${messageIn}, ${(p) => messageOut(p.height)};
  animation-delay: 0s, ${(p) => p.time - ANIMATION_DURATION}s;
  animation-duration: ${ANIMATION_DURATION}s;
  border-radius: ${(p) => p.theme.borderRadius.default};
  backdrop-filter: blur(10px);
`;

export const TextWrapper = styled.div``;

export const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;
