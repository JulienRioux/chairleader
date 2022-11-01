import { useMutation } from '@apollo/client';
import { Button, Input, message } from 'components-library';
import { APP_NAME } from 'configs';
import { AUTHENTICATE } from 'queries';
import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Logger, routes } from 'utils';
import background1 from 'pages/features-page/background/background-1.png';
import { slideInBottom, slideInLeft } from 'utils/keyframes';

const HalfImagePageLayoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 4fr 6fr;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const Img = styled.img`
  width: 100%;
  object-position: center;
  object-fit: cover;
  height: 100vh;
  background: ${(p) => p.theme.color.lightGrey};
  image-rendering: pixelated;
  position: sticky;
  top: 0;
  z-index: -1;
  opacity: 0;
  animation: 0.4s ${slideInLeft} forwards;

  @media (max-width: 800px) {
    display: none;
  }
`;

const ChildrenWrapper = styled.div`
  max-width: 100%;
  width: 100%;
  opacity: 0;
  animation: 0.4s ${slideInBottom} 0.1s forwards;
  /* margin: 100px auto; */
`;

const ChildrenInnerWrapper = styled.div`
  padding: 20px;
`;

const BackButtonWrapper = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 9;
`;

const AuthPageWrapper = styled.div`
  margin: 100px auto;
  width: ${(p) => p.theme.layout.smallWidth};
`;

export const HalfImagePageLayout = ({
  children,
  img,
}: {
  children: ReactNode;
  img?: string;
}) => {
  const navigate = useNavigate();
  return (
    <HalfImagePageLayoutWrapper>
      <BackButtonWrapper>
        <Button onClick={() => navigate(-1)} secondary icon="arrow_back" />
      </BackButtonWrapper>
      <Img src={img ?? background1} />
      <ChildrenWrapper>
        <ChildrenInnerWrapper>{children} </ChildrenInnerWrapper>
      </ChildrenWrapper>
    </HalfImagePageLayoutWrapper>
  );
};

const Par = styled.p`
  color: ${(p) => p.theme.color.lightText};
`;

export const OtpForm = ({ buttonText = 'Send magic link' }) => {
  const [email, setEmail] = useState('');
  const [authenticate, { loading: authIsLoading }] = useMutation(AUTHENTICATE);

  const navigate = useNavigate();

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      // Authenticate
      try {
        const hostname = window.location.origin;
        const authenticateResponse = await authenticate({
          variables: { email, hostname },
        });
        const signupStatus = authenticateResponse?.data?.authenticate?.status;
        if (signupStatus === 202) {
          message.success(`A login email has been sent to ${email}!`);
          navigate(`${routes.magicLink}/${email}`);
          return;
        }

        message.error('Something went wrong... Please try again.');
      } catch (err) {
        message.error('Something went wrong... Please try again.');
        Logger.error(err);
      }
    },
    [email, navigate, authenticate]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        value={email}
        onChange={handleChange}
        placeholder="Enter your email to login or register"
        required
        type="email"
      />

      <Button isLoading={authIsLoading} type="submit" fullWidth>
        {buttonText}
      </Button>

      <Par>
        By clicking &quot;Create account&quot;, I agree to {APP_NAME}&apos;s{' '}
        <Link to={routes.static.termsOfService}>TOS</Link> and{' '}
        <Link to={routes.static.privacy}>privacy policy</Link>.
      </Par>
    </form>
  );
};

export const AuthPage = () => {
  return (
    <HalfImagePageLayout>
      <AuthPageWrapper>
        <h1>Register or log in</h1>

        <OtpForm />
      </AuthPageWrapper>
    </HalfImagePageLayout>
  );
};
