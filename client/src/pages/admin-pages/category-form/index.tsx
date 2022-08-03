import { Input, Button } from 'components-library';
import { useState, ChangeEvent, useCallback, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { routes } from 'utils';

const CategoryFormWrapper = styled.form`
  max-width: ${(p) => p.theme.layout.mediumWidth};
  margin: 40px auto;
`;

export const CategoryForm = () => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      // Fake log in...
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate(routes.admin.inventory);
      }, 1000);

      // Do something here...
    },
    [navigate]
  );

  const FormBtnWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
  `;

  return (
    <CategoryFormWrapper onSubmit={handleSubmit}>
      <Input
        label="Category name"
        value={name}
        onChange={handleChange}
        placeholder="Enter the category name"
        required
      />

      <FormBtnWrapper>
        <Button isLoading={isLoading} type="submit">
          Add category
        </Button>
      </FormBtnWrapper>
    </CategoryFormWrapper>
  );
};
