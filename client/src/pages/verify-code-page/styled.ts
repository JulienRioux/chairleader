import { UnstyledButton } from 'components-library';
import styled from 'styled-components';

export const OtpPageWrapper = styled.div`
  margin: 100px auto;
  width: ${(p) => p.theme.layout.smallWidth};
`;

export const ResendCodeBtn = styled(UnstyledButton)`
  color: ${(p) => p.theme.color.primary};
  text-decoration: underline;
`;
