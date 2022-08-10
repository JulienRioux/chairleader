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
} from 'components-library';
import { USE_CATEGORY } from 'configs';
import { useAuth } from 'hooks/auth';
import { useInventory } from 'hooks/inventory';
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
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { resizeFileImg, routes } from 'utils';

const FormWrapper = styled.form`
  max-width: ${(p) => p.theme.layout.mediumWidth};
  margin: 40px auto;
`;

const ImgWrapper = styled(UnstyledButton)`
  width: 100%;
  object-position: center;
  object-fit: cover;
  aspect-ratio: ${(p) => p.theme.products.image.aspectRatio};
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 2px solid ${(p) => p.theme.color.text};
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

const AddImgBtn = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 8px 12px;
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 2px solid ${(p) => p.theme.color.lightGrey};
  color: ${(p) => p.theme.color.primary};
  background: ${(p) => p.theme.color.background};
  font-size: 16px;
  font-weight: bold;
`;

const FormBtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

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

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <ImgWrapper type="button" onClick={handleUploadFileClick}>
        {currentImageSrc ? (
          <>
            <Img src={currentImageSrc} />

            <AddImgBtn>
              {resizeImgIsLoading ? 'Loading...' : 'Change image'}
            </AddImgBtn>
          </>
        ) : (
          <>
            <Icon name="image" />

            <AddImgBtn>
              {resizeImgIsLoading ? 'Loading...' : 'Add image'}
            </AddImgBtn>
          </>
        )}
      </ImgWrapper>

      <VisuallyHiddenInput
        type="file"
        onChange={handleChange}
        name="image"
        accept="image/png, image/jpg, image/jpeg, image/webp"
        ref={fileInput}
      />

      <Input
        label="Product name"
        value={title}
        onChange={handleChange}
        placeholder="Enter the product name"
        required
        name="title"
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

      <Input
        label={`Product price (${user?.currency})`}
        value={price}
        onChange={handleChange}
        placeholder={`Enter the product price in ${user?.currency}`}
        required
        name="price"
        type="number"
        step={0.00000000001}
        min={0}
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
          {isEditting ? 'Edit product' : 'Add product'}
        </Button>
      </FormBtnWrapper>
    </FormWrapper>
  );
};
