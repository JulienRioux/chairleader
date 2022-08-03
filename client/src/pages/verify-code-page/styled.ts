import { UnstyledButton } from 'components-library';
import styled from 'styled-components';

export const OtpPageWrapper = styled.div`
  max-width: 400px;
  margin: 40px auto;
`;

export const ResendCodeBtn = styled(UnstyledButton)`
  color: ${(p) => p.theme.color.primary};
  text-decoration: underline;
`;
