import { Icon } from 'components-library';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { spin } from 'utils/keyframes';

const ButtonWrapper = styled.button<{
  secondary?: boolean;
  fullWidth?: boolean;
  isIconBtn?: boolean;
}>`
  position: relative;
  align-items: center;
  border-radius: ${(p) => p.theme.borderRadius.default};
  border-style: solid;
  border-width: 2px;
  border-color: ${(p) => p.theme.color.primary};
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  justify-content: center;
  line-height: 1;
  ${(p) =>
    p.isIconBtn
      ? css`
          padding: 10px;
          font-size: 20px;
        `
      : css`
          padding: 12px 16px;
          min-width: 120px;
        `}

  transition: 0.2s all, 0s color;
  white-space: nowrap;
  color: ${(p) => p.theme.color.buttonText};
  background-color: ${(p) => p.theme.color.primary};
  text-decoration: none;
  font-weight: bold;

  ${(p) =>
    p.secondary &&
    css`
      border-color: ${(p) => p.theme.color.lightGrey};
      color: ${(p) => p.theme.color.primary};
      background-color: ${(p) => p.theme.color.background};
    `}

  ${(p) => p.fullWidth && 'width: 100%;'}


  :disabled {
    background-color: ${(p) => p.theme.color.text}55;
    border-color: ${(p) => p.theme.color.text}22;
    color: ${(p) => p.theme.color.buttonText};
    cursor: not-allowed;
  }
`;

export const UnstyledButton = styled.button<{ hasAnimation?: boolean }>`
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font-size: inherit;
  color: ${(p) => p.theme.color.text};
`;

export const UnstyledLink = styled(Link)`
  text-decoration: none;
  color: ${(p) => p.theme.color.text};
`;

export const UnstyledExternalLink = styled.a`
  text-decoration: none;
  color: ${(p) => p.theme.color.text};
`;

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
`;

const InnerLoader = styled.div`
  border: 2px solid ${(p) => p.theme.color.buttonText};
  border-right-color: transparent;
  border-radius: 50%;
  height: 16px;
  width: 16px;
  animation: 1.6s ${spin} linear infinite;
`;

const BtnLoader = () => (
  <LoaderWrapper>
    <InnerLoader />
  </LoaderWrapper>
);

const ChildWrapper = styled.span<{ $isLoading?: boolean }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  ${(p) =>
    p.$isLoading &&
    css`
      opacity: 0;
    `}
`;

export const Button = ({
  isLoading,
  children,
  secondary,
  to,
  icon,
  fullWidth,
  ...props
}: any) => {
  const button = (
    <ButtonWrapper
      secondary={secondary}
      isIconBtn={!children && icon}
      fullWidth={fullWidth}
      {...props}
    >
      {isLoading && <BtnLoader />}

      <ChildWrapper $isLoading={isLoading}>
        {icon && <Icon name={icon} />}
        {children}
      </ChildWrapper>
    </ButtonWrapper>
  );
  return to ? <UnstyledLink to={to}>{button}</UnstyledLink> : button;
};
