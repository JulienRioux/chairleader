import { Button, Input, Loader } from 'components-library';
import { useAuth } from 'hooks/auth';
import { UpdateUserForm } from 'pages/complete-signup-page';
import styled from 'styled-components';

const UserPageWrapper = styled.div`
  margin: 0 auto;
  max-width: ${(p) => p.theme.layout.mediumWidth};
`;

export const UserPage = () => {
  const { logoutUser, isLoading, user } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <UserPageWrapper>
      <h1>Update store</h1>
      <Input label="Email" value={user?.email} onChange={() => null} disabled />
      <UpdateUserForm />
      <Button
        style={{ marginTop: '12px' }}
        fullWidth
        secondary
        onClick={logoutUser}
      >
        Log out
      </Button>
    </UserPageWrapper>
  );
};
