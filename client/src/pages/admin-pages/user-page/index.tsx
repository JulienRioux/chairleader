import { Button, Input, Loader } from 'components-library';
import { useAuth } from 'hooks/auth';
import { UpdateUserForm } from 'pages/complete-signup-page';
import styled from 'styled-components';

const UserPageWrapper = styled.div`
  margin: 0 auto;
  max-width: ${(p) => p.theme.layout.mediumWidth};
`;

export const UserPage = () => {
  const { logoutUser, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <UserPageWrapper>
      <UpdateUserForm />
      <Button
        style={{ marginTop: '8px' }}
        fullWidth
        secondary
        onClick={logoutUser}
      >
        Log out
      </Button>
    </UserPageWrapper>
  );
};
