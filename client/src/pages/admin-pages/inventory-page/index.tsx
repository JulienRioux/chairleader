import { Button, Input, Loader, useModal } from 'components-library';
import { ProductPreview } from 'components/product-preview';
import { useCart } from 'hooks/cart';
import { useCurrency } from 'hooks/currency';
import { useInventory } from 'hooks/inventory';
import { useStore } from 'hooks/store';
import { useState, useCallback, FormEvent } from 'react';
import styled, { css } from 'styled-components';

const PosStyles = css`
  grid-template-columns: 1fr 1fr 1fr 1fr;

  @media (max-width: 1400px) {
    grid-template-columns: 1fr 1fr 1fr;
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

export const InventoryPage = () => {
  const { inventory, isLoading } = useInventory();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <ProductGrid>
        {inventory?.map(({ image, title, price, _id }) => (
          <ProductPreview
            key={_id}
            image={image}
            title={title}
            price={price?.toString()}
            id={_id}
          />
        ))}

        {!inventory?.length && <p>No product yet.</p>}
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

        <Modal title="Custom product">
          <AddCustomItem closeModal={closeModal} />
        </Modal>
      </ProductGrid>
    </div>
  );
};
