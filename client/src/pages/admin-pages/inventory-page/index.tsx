import { Button, Input, Loader, useModal, Textarea } from 'components-library';
import { ProductPreview } from 'components/product-preview';
import { IInventoryItem, useCart } from 'hooks/cart';
import { useCurrency } from 'hooks/currency';
import { useInventory } from 'hooks/inventory';
import { useStore } from 'hooks/store';
import {
  useState,
  useCallback,
  FormEvent,
  ChangeEvent,
  useEffect,
} from 'react';
import styled, { css } from 'styled-components';

const PosStyles = css`
  grid-template-columns: 1fr 1fr 1fr 1fr;

  @media (max-width: 1400px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 1000px) {
    margin-bottom: 80px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const AdminStyles = css`
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const ProductGrid = styled.div<{ isPos?: boolean }>`
  display: grid;
  grid-gap: 40px 20px;
  max-width: 1600px;
  margin: 0 auto;

  ${(p) => (p.isPos ? PosStyles : AdminStyles)}
`;

const AddCustomProductBtn = styled(Button)`
  aspect-ratio: ${(p) => p.theme.products.image.aspectRatio};
`;

const Form = styled.form`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  margin-bottom: 20px;

  button {
    margin-left: 8px;
  }

  input {
    max-width: 400px;
  }
`;

export const InventoryPage = () => {
  const { inventory, isLoading } = useInventory();

  const [searchString, setSearchString] = useState('');
  const [result, setResult] = useState<IInventoryItem[]>(inventory);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const searchResult = inventory.filter(({ title }) => {
        return title.toLowerCase().includes(searchString.toLowerCase());
      });
      setResult(searchResult);
    },
    [inventory, searchString]
  );

  useEffect(() => {
    setResult(inventory);
  }, [inventory]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Input
          value={searchString}
          onChange={handleChange}
          placeholder="Search for item name"
        />
        <Button icon="search" secondary />
      </Form>

      <ProductGrid>
        {result?.map(({ image, title, price, _id }) => (
          <ProductPreview
            key={_id}
            image={image}
            title={title}
            price={price?.toString()}
            id={_id}
          />
        ))}

        {!inventory?.length && <p>No product yet.</p>}

        {!!inventory?.length && !result.length && searchString && (
          <p>No search result.</p>
        )}
      </ProductGrid>
    </div>
  );
};

const AddCustomItem = ({ closeModal }: { closeModal: () => void }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { currency, decimals } = useCurrency();

  const { handleAddCustomItems } = useCart();

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      handleAddCustomItems({ title, price: Number(price) });

      closeModal();
    },
    [closeModal, handleAddCustomItems, price, title]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Product title"
        placeholder="Enter the product title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        autoFocus
      />

      <Input
        label={`Product price (${currency})`}
        placeholder="Enter the product price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        type="number"
        min="0"
        step={1 / 10 ** decimals}
      />

      <Button fullWidth type="submit">
        Add product
      </Button>
    </form>
  );
};

export const StorePage = () => {
  const { inventory, isLoading } = useStore();

  const { openModal, Modal, closeModal } = useModal();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <ProductGrid isPos>
        {inventory?.map(({ image, title, price, _id, totalSupply }) => (
          <ProductPreview
            key={_id}
            image={image}
            title={title}
            price={price?.toString()}
            id={_id}
            isPos
            totalSupply={totalSupply}
          />
        ))}

        <AddCustomProductBtn onClick={openModal} secondary>
          Add custom product
        </AddCustomProductBtn>

        {!inventory?.length && <p>No product yet.</p>}

        <Modal title="New custom product">
          <AddCustomItem closeModal={closeModal} />
        </Modal>
      </ProductGrid>
    </div>
  );
};
