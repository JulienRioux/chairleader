import { useMutation, useQuery } from '@apollo/client';
import {
  Input,
  Button,
  Textarea,
  Select,
  Icon,
  UnstyledButton,
  VisuallyHiddenInput,
  message,
  Loader,
  UnstyledLink,
} from 'components-library';
import { Label } from 'components-library/input/input.styles';
import { TokenGatedBadge } from 'components/product-preview';
import { USE_CATEGORY } from 'configs';
import { useAuth } from 'hooks/auth';
import { useInventory } from 'hooks/inventory';
import { useNft } from 'hooks/nft';
import { useScrollTop } from 'hooks/scroll-top';
import {
  ADD_PRODUCT,
  DELETE_PRODUCT_BY_ID,
  EDIT_PRODUCT,
  GET_PRODUCTS_BY_USER_ID,
} from 'queries';
import {
  useState,
  ChangeEvent,
  useCallback,
  FormEvent,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { formatShortAddress, resizeFileImg, routes } from 'utils';

const FormWrapper = styled.form`
  max-width: ${(p) => p.theme.layout.mediumWidth};
  margin: 40px auto;
`;

const ImgWrapper = styled(UnstyledButton)`
  width: 100%;
  max-width: 200px;
  object-position: center;
  object-fit: cover;
  aspect-ratio: ${(p) => p.theme.products.image.aspectRatio};
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: ${(p) => p.theme.borderWidth} solid ${(p) => p.theme.color.text}66;
  font-size: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.color.lightGrey};
  position: relative;
  overflow: hidden;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-position: center;
  object-fit: cover;
  position: relative;
`;

const AddImgBtn = styled(Button)`
  margin-left: 12px;
`;

const ImgAndBtnWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin: 8px 0 12px;
`;

const TokenGatingMasterLink = styled(UnstyledLink)`
  margin: 8px 12px 8px 0;
  padding: 8px;
  border: ${(p) => p.theme.borderWidth} solid;
  border-radius: ${(p) => p.theme.borderRadius.input};
  font-weight: bold;
`;

const FormBtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ProductFormCardWrapper = styled.div`
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 1px solid ${(p) => p.theme.color.lightGrey};
  margin-bottom: 20px;
`;

const ProductFormCardTitle = styled.h3`
  margin: 0 0 16px;
  padding: 12px;
  font-size: 20px;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
`;

const ProductFormCardText = styled.p`
  color: ${(p) => p.theme.color.lightText};
  padding: 0 12px;
  font-size: 14px;
  margin-top: 4px;
`;

const ProductFormCardContent = styled.div`
  padding: 0 12px;
`;

const ProductFormCard = ({
  title,
  text,
  children,
}: {
  title: ReactNode;
  text: ReactNode;
  children: ReactNode;
}) => (
  <ProductFormCardWrapper>
    <ProductFormCardTitle>{title}</ProductFormCardTitle>
    <ProductFormCardText>{text}</ProductFormCardText>
    <ProductFormCardContent>{children}</ProductFormCardContent>
  </ProductFormCardWrapper>
);

const CATECORY_OPTIONS = [
  {
    value: 'running-shoes',
    label: 'Running shoes',
  },
];

const QTY_OPTIONS = [
  // {
  //   value: 'unlimited',
  //   label: 'Unlimited',
  // },
  ...Array.from({ length: 100 }, (_, i) => ({
    value: i.toString(),
    label: i.toString(),
  })),
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

const PRODUCT_TYPE_OPTIONS = [
  { value: 'simpleProduct', label: 'Simple product' },
  { value: 'productWithVariants', label: 'Product with variants' },
];

export const ProductForm = () => {
  useScrollTop();

  const { user, currencyDecimals } = useAuth();

  const [imageSrc, setImageSrc] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [resizeImgIsLoading, setResizeImgIsLoading] = useState(false);

  const [status, setStatus] = useState(STATUS_OPTIONS[0].value);

  const [productType, setProductType] = useState(PRODUCT_TYPE_OPTIONS[0].value);

  const { mapProductLockedToMaster } = useNft();

  const [deleteProductById, { loading: deleteProductIsLoading }] =
    useMutation(DELETE_PRODUCT_BY_ID);

  const { refetch } = useQuery(GET_PRODUCTS_BY_USER_ID);

  const [addProduct, { loading: addProductIsLoading }] =
    useMutation(ADD_PRODUCT);

  const [editProduct, { loading: editProductIsLoading }] =
    useMutation(EDIT_PRODUCT);

  const { inventory, isLoading: inventoryIsLoading } = useInventory();

  const navigate = useNavigate();

  const { productId } = useParams();

  const isEditting = !!productId;

  const fileInput = useRef<HTMLInputElement | null>(null);

  const handleUploadFileClick = useCallback(() => {
    // Click on the visually hidden file input
    if (fileInput?.current) {
      fileInput.current.click();
    }
  }, []);

  useEffect(() => {
    if (productId) {
      const currentProduct = inventory.find(({ _id }) => _id === productId);
      if (currentProduct) {
        setTitle(currentProduct.title);
        setDescription(currentProduct.description);
        const priceDisplay = Number(
          currentProduct.price?.toFixed(currencyDecimals)
        );
        setPrice(priceDisplay.toString());
        setTotalSupply(currentProduct.totalSupply?.toString());
        setImageSrc(currentProduct.image);
        setStatus(currentProduct.status);
      }
    }
  }, [currencyDecimals, inventory, productId]);

  useEffect(() => {
    if (!isEditting) {
      setTitle('');
      setDescription('');
      setPrice('');
      setTotalSupply('');
      setImageSrc('');
    }
  }, [isEditting]);

  const handleChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.target.name === 'title') {
        setTitle(e.target.value);
      }
      if (e.target.name === 'description') {
        setDescription(e.target.value);
      }
      if (e.target.name === 'price') {
        setPrice(e.target.value);
      }
      if (e.target.name === 'category') {
        setCategory(e.target.value);
      }
      if (e.target.name === 'totalSupply') {
        setTotalSupply(e.target.value);
      }
      if (e.target.name === 'status') {
        setStatus(e.target.value);
      }
      if (e.target.name === 'productType') {
        setProductType(e.target.value);
      }
      if (e.target.name === 'image') {
        const files = (e.target as HTMLInputElement)?.files as FileList;
        if (files[0]) {
          // Resize the image and store the image
          setResizeImgIsLoading(true);
          const resizedFile = await resizeFileImg(files[0]);
          if (resizedFile) {
            setImageFile(resizedFile);
          }
          setResizeImgIsLoading(false);
        }
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (isEditting) {
        const product = await editProduct({
          variables: {
            productId,
            title,
            image: imageFile,
            description,
            price,
            totalSupply,
            status,
          },
        });

        message.success(
          `${product?.data?.editProduct?.title} has been edited.`
        );
      } else {
        const product = await addProduct({
          variables: {
            title,
            image: imageFile,
            description,
            price,
            totalSupply,
            status,
          },
        });

        message.success(`${product?.data?.addProduct?.title} has been added.`);
      }

      refetch();
      navigate(routes.admin.inventory);
    },
    [
      isEditting,
      refetch,
      navigate,
      editProduct,
      productId,
      title,
      imageFile,
      description,
      price,
      totalSupply,
      addProduct,
      status,
    ]
  );

  const handleDeleteProductById = useCallback(async () => {
    const product = await deleteProductById({ variables: { id: productId } });

    refetch();
    message.success(
      `${product?.data?.deleteProductById?.title} has been deleted.`
    );
    navigate(routes.admin.inventory);
  }, [deleteProductById, navigate, productId, refetch]);

  let currentImageSrc = imageSrc;

  if (imageFile) {
    currentImageSrc = URL.createObjectURL(imageFile);
  }

  if (inventoryIsLoading) {
    return <Loader />;
  }

  const masterNftLocks = mapProductLockedToMaster[productId ?? ''];

  const isTokenGatedProduct = !!masterNftLocks;

  // Show different form if it's a product with variant or simple product.
  const IS_PRODUCT_WITH_VARIANTS = productType === 'simpleProduct';

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <ProductFormCard
        title="General"
        text="To start selling, all you need is a name, description, price, and image."
      >
        <Input
          label="Product name"
          value={title}
          onChange={handleChange}
          placeholder="Enter the product name"
          required
          name="title"
        />

        {USE_CATEGORY && (
          <Select
            label="Category"
            value={category}
            onChange={handleChange}
            options={CATECORY_OPTIONS}
            name="category"
            id="category"
            placeholder="Select a product category"
          />
        )}

        <Textarea
          label="Product description"
          value={description}
          onChange={handleChange}
          placeholder="Enter the product description"
          name="description"
          rows={8}
        />
      </ProductFormCard>

      <ProductFormCard title="Image" text="Add an image to your product.">
        <ImgAndBtnWrapper>
          <ImgWrapper type="button" onClick={handleUploadFileClick}>
            {currentImageSrc ? (
              <Img src={currentImageSrc} />
            ) : (
              <Icon name="image" />
            )}

            {isTokenGatedProduct && <TokenGatedBadge isPositionAbsolute />}

            <VisuallyHiddenInput
              type="file"
              onChange={handleChange}
              name="image"
              accept="image/png, image/jpg, image/jpeg, image/webp"
              ref={fileInput}
            />
          </ImgWrapper>

          <AddImgBtn type="button" secondary onClick={handleUploadFileClick}>
            {resizeImgIsLoading && 'Loading...'}
            {!resizeImgIsLoading && currentImageSrc
              ? 'Change image'
              : 'Add image'}
          </AddImgBtn>
        </ImgAndBtnWrapper>
      </ProductFormCard>

      <ProductFormCard
        title="Product type"
        text="Product with variants are products are used to offer product variations like sizes, colors, etc."
      >
        <Select
          label="Product type"
          value={productType}
          onChange={handleChange}
          options={PRODUCT_TYPE_OPTIONS}
          name="productType"
          id="productType"
          placeholder="Select a product type"
          required
        />
      </ProductFormCard>

      {IS_PRODUCT_WITH_VARIANTS && (
        <ProductFormCard title="Pricing" text="Give products a price.">
          <Input
            label="Product price"
            value={price}
            onChange={handleChange}
            placeholder={`Enter the product price in ${user?.currency}`}
            required
            name="price"
            type="number"
            step={0.00000000001}
            min={0}
          />

          <Select
            label="Total supply"
            value={totalSupply}
            onChange={handleChange}
            options={QTY_OPTIONS}
            name="totalSupply"
            id="totalSupply"
            placeholder="Select a total supply"
            required
          />
        </ProductFormCard>
      )}

      {!IS_PRODUCT_WITH_VARIANTS && (
        <ProductFormCard
          title="Variants"
          text="Add variations of this product. Offer your customers different options for color, format, size, shape, etc.
"
        >
          <Input
            label="Product price"
            value={price}
            onChange={handleChange}
            placeholder={`Enter the product price in ${user?.currency}`}
            required
            name="price"
            type="number"
            step={0.00000000001}
            min={0}
          />

          <Select
            label="Total supply"
            value={totalSupply}
            onChange={handleChange}
            options={QTY_OPTIONS}
            name="totalSupply"
            id="totalSupply"
            placeholder="Select a total supply"
            required
          />
        </ProductFormCard>
      )}

      {isTokenGatedProduct && (
        <ProductFormCard
          title="Exclusivities (NFTs gating)"
          text="NFT gating is used to create value for your community members."
        >
          <>
            <Label>NFTs unlocking this product</Label>

            <div style={{ display: 'flex' }}>
              {masterNftLocks?.map((masterAddress: string) => (
                <TokenGatingMasterLink
                  key={masterAddress}
                  to={`${routes.admin.tokenGating}/${masterAddress}`}
                >
                  {formatShortAddress(masterAddress)}
                </TokenGatingMasterLink>
              ))}
            </div>
          </>
        </ProductFormCard>
      )}

      <ProductFormCard
        title="Product status"
        text="Only published products are visible in your store."
      >
        <Select
          label="Status"
          value={status}
          onChange={handleChange}
          options={STATUS_OPTIONS}
          name="status"
          id="status"
          placeholder="Select a product status"
        />
      </ProductFormCard>

      <FormBtnWrapper>
        {isEditting && (
          <Button
            style={{ marginRight: '8px' }}
            secondary
            isLoading={deleteProductIsLoading}
            type="button"
            onClick={handleDeleteProductById}
          >
            Delete product
          </Button>
        )}
        <Button
          isLoading={addProductIsLoading || editProductIsLoading}
          type="submit"
        >
          {`Save ${status === 'draft' ? 'as draft' : 'and publish'}`}
        </Button>
      </FormBtnWrapper>
    </FormWrapper>
  );
};
