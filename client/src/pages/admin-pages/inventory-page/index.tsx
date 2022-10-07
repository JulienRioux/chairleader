import {
  Button,
  CartItemSkeleton,
  Input,
  Loader,
  useModal,
} from 'components-library';
import { ProductPreview } from 'components/product-preview';
import { IS_POINT_OF_SALE, MAX_PRODUCTS } from 'configs';
import { IInventoryItem, useCart } from 'hooks/cart';
import { useCurrency } from 'hooks/currency';
import { useInventory } from 'hooks/inventory';
import { useMediaQuery } from 'hooks/media-query';
import { useStore } from 'hooks/store';
import {
  useState,
  useCallback,
  FormEvent,
  ChangeEvent,
  useEffect,
} from 'react';
import styled, { css } from 'styled-components';
import { routes } from 'utils';

const PosStyles = css`
  grid-template-columns: 1fr 1fr 1fr 1fr;

  @media (max-width: 920px) {
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
  grid-gap: 20px;
  margin: 0 auto;

  ${(p) => (p.isPos ? PosStyles : AdminStyles)}
`;

const TopBtnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const AddCustomProductBtn = styled(Button)`
  aspect-ratio: ${(p) => p.theme.products.image.aspectRatio};
`;

const Form = styled.form`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  margin-bottom: 20px;
  width: -webkit-fill-available;

  button {
    margin-left: 8px;
  }

  input {
    max-width: 400px;
  }
`;
const InventoryPageWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

const ProductNum = styled.p`
  color: ${(p) => p.theme.color.lightText};
  /* font-size: 14px; */
  margin-top: 20px;
  text-align: right;
`;

export const InventoryPage = () => {
  const { inventory, isLoading } = useInventory();
  const isMobileView = useMediaQuery('(max-width: 800px)');

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
    <InventoryPageWrapper>
      <TopBtnWrapper>
        <Button
          to={routes.admin.newProduct}
          icon={isMobileView ? 'add' : undefined}
          style={{ marginRight: '8px' }}
          disabled={inventory.length >= MAX_PRODUCTS}
        >
          {isMobileView ? '' : 'Add product'}
        </Button>

        <Form onSubmit={handleSubmit}>
          <Input
            value={searchString}
            onChange={handleChange}
            placeholder="Search for item name"
          />
          <Button icon="search" secondary />
        </Form>
      </TopBtnWrapper>

      <ProductGrid>
        {result?.map(
          ({
            image,
            title,
            price,
            _id,
            status,
            allPossibleVariantsObject,
            productType,
          }) => (
            <ProductPreview
              key={_id}
              image={image}
              title={title}
              price={price?.toString()}
              id={_id}
              status={status}
              allPossibleVariantsObject={allPossibleVariantsObject}
              productType={productType}
            />
          )
        )}

        {!inventory?.length && <p>No product yet.</p>}

        {!!inventory?.length && !result.length && searchString && (
          <p>No search result.</p>
        )}
      </ProductGrid>

      {!!inventory?.length && (
        <ProductNum>{inventory?.length} products</ProductNum>
      )}
    </InventoryPageWrapper>
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
    return (
      <ProductGrid isPos>
        <CartItemSkeleton />
      </ProductGrid>
    );
  }

  const publishedInventory = inventory.filter(
    ({ status }) => status !== 'draft'
  );

  return (
    <div>
      <ProductGrid isPos>
        {publishedInventory?.map(
          ({
            image,
            title,
            price,
            _id,
            totalSupply,
            allPossibleVariantsObject,
            productType,
          }) => (
            <ProductPreview
              key={_id}
              image={image}
              title={title}
              price={price?.toString()}
              id={_id}
              isPos
              totalSupply={totalSupply}
              allPossibleVariantsObject={allPossibleVariantsObject}
              productType={productType}
            />
          )
        )}

        {IS_POINT_OF_SALE && (
          <AddCustomProductBtn onClick={openModal} secondary>
            Add custom product
          </AddCustomProductBtn>
        )}

        {!publishedInventory?.length && <p>No product yet.</p>}

        <Modal title="New custom product">
          <AddCustomItem closeModal={closeModal} />
        </Modal>
      </ProductGrid>
    </div>
  );
};
