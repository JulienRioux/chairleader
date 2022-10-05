import { useMutation, useQuery } from '@apollo/client';
import {
  Input,
  Button,
  Textarea,
  Select,
  Icon,
  VisuallyHiddenInput,
  message,
  Loader,
  TagInput,
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
import { formatShortAddress, resizeFileImg, routes } from 'utils';
import {
  AlertWrapper,
  ProductFormCardTitle,
  ProductFormCardWrapper,
  ProductFormCardText,
  ProductFormCardContent,
  ImgAndBtnWrapper,
  ImgWrapper,
  FormBtnWrapper,
  FormWrapper,
  TokenGatingMasterLink,
  VariationWrapper,
  VariationInputsWrapper,
  VariantsContentWrapper,
  AddAnOptionBtnWrapper,
  AddAnButton,
  AddImgBtn,
  Img,
  OptionTitle,
  OptionInputs,
  VariantTableTitleWrapper,
  VariationName,
} from './product-form.styles';

const Alert = ({ children }: { children: ReactNode }) => (
  <AlertWrapper>
    <Icon style={{ marginRight: '8px' }} name="warning_amber" />
    <span>{children}</span>
  </AlertWrapper>
);

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

const CATECORY_OPTIONS = [{ value: 'running-shoes', label: 'Running shoes' }];

const QTY_OPTIONS = [
  ...Array.from({ length: 101 }, (_, i) => ({
    value: i.toString(),
    label: i.toString(),
  })),
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

export enum PRODUCT_TYPE {
  SIMPLE_PRODUCT = 'simpleProduct',
  PRODUCT_WITH_VARIANT = 'productWithVariants',
}

const PRODUCT_TYPE_OPTIONS = [
  { value: PRODUCT_TYPE.SIMPLE_PRODUCT, label: 'Simple product' },
  { value: PRODUCT_TYPE.PRODUCT_WITH_VARIANT, label: 'Product with variants' },
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

  const [variantNames, setVariantNames] = useState<string[]>([]);
  const [variantNamesError, setVariantNamesError] = useState(false);

  const [variantsValues, setVariantsValues] = useState<any[]>([[]]);
  const [variantsValuesError, setVariantsValuesError] = useState(false);

  const [allPossibleVariants, setAllPossibleVariants] = useState<string[]>([]);
  const [allPossibleVariantsObject, setAllPossibleVariantsObject] =
    useState<any>({});
  const [variantPriceAndInventoryError, setVariantPriceAndInventoryError] =
    useState(false);

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
        if (currentProduct.price) {
          const priceDisplay = Number(
            currentProduct.price?.toFixed(currencyDecimals)
          );
          setPrice(priceDisplay.toString());
        }
        setTotalSupply(currentProduct.totalSupply?.toString());
        setImageSrc(currentProduct.image);
        setStatus(currentProduct.status);
        setProductType(currentProduct.productType as PRODUCT_TYPE);
        setVariantNames(currentProduct.variantNames ?? []);
        setVariantsValues(currentProduct.variantsValues ?? [[]]);
        setAllPossibleVariantsObject(
          currentProduct.allPossibleVariantsObject ?? {}
        );
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
        setProductType(e.target.value as PRODUCT_TYPE);
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

  const handleVariantsChange = useCallback(
    ({
      variantTags,
      variantIndex,
    }: {
      variantTags: string[];
      variantIndex: number;
    }) => {
      setVariantsValuesError(false);
      const variantsCopy = [...variantsValues];
      variantsCopy[variantIndex] = variantTags;
      setVariantsValues(variantsCopy);
    },
    [variantsValues]
  );

  const handleVariantNameChange = useCallback(
    (e: any, index: number) => {
      setVariantNamesError(false);
      const variantNameCopy = [...variantNames];
      variantNameCopy[index] = e.target.value;
      setVariantNames(variantNameCopy);
    },
    [variantNames]
  );

  const handleRemoveTag = useCallback(
    ({ variantIndex, tagIndex }: any) => {
      // Remove the variants values
      const variantsCopy = [...variantsValues];
      const updatedCurrentVariant = variantsCopy[variantIndex].filter(
        (el: string, i: number) => i !== tagIndex
      );
      variantsCopy[variantIndex] = updatedCurrentVariant;
      setVariantsValues(variantsCopy);
    },
    [variantsValues]
  );

  const handleAddVariantOption = useCallback(() => {
    // TODO: Prevent variant name dulication.
    setVariantsValues([...variantsValues, []]);
    setVariantNames([...variantNames, '']);
  }, [variantNames, variantsValues]);

  const handleRemoveOption = useCallback(
    (variantIndex: number) => {
      // Remove the variants values
      const variantsCopy = [...variantsValues];
      variantsCopy.splice(variantIndex, 1);
      setVariantsValues(variantsCopy);

      // Remove the variants name
      const variantNamesCopy = [...variantNames];
      variantNamesCopy.splice(variantIndex, 1);
      setVariantNames(variantNamesCopy);
    },
    [variantNames, variantsValues]
  );

  useEffect(() => {
    const currentPossibleVariants = variantsValues.reduce(
      (a, b) =>
        a.flatMap((x: string) =>
          b.map((y: string) => {
            if (x === '') return y;
            return x + ' / ' + y;
          })
        ),
      ['']
    );

    // Prevent infinite loop (new array is not the same)
    if (
      JSON.stringify(allPossibleVariants) ===
      JSON.stringify(currentPossibleVariants)
    ) {
      return;
    }

    const variantsObject: any = {};

    // Set the current variation value if it exists
    currentPossibleVariants.forEach((varOption: string) => {
      variantsObject[varOption] = {
        price: allPossibleVariantsObject[varOption]?.price,
        qty: allPossibleVariantsObject[varOption]?.qty,
      };
    });
    setAllPossibleVariants(currentPossibleVariants);
    setAllPossibleVariantsObject(variantsObject);
  }, [allPossibleVariants, allPossibleVariantsObject, variantsValues]);

  const handleVariationObjectChange = useCallback(
    ({
      event,
      variation,
      type,
    }: {
      event: any;
      variation: string;
      type: 'price' | 'qty';
    }) => {
      setVariantPriceAndInventoryError(false);
      const allPossibleVariantsObjectCopy = structuredClone(
        allPossibleVariantsObject
      );
      allPossibleVariantsObjectCopy[variation][type] = event.target.value;

      setAllPossibleVariantsObject(allPossibleVariantsObjectCopy);
    },
    [allPossibleVariantsObject]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Init the error values
      let variantNamesErrorVal = false;
      let variantsValuesError = false;
      let variantPriceAndInventoryError = false;

      // Check the product type first
      if (productType === PRODUCT_TYPE.PRODUCT_WITH_VARIANT) {
        // Check if there are errors in the variants form

        // Check if there is error for the variant names
        variantNamesErrorVal = variantNames.includes('');

        // Check if there is error for the variants values
        variantsValuesError = variantsValues.some(
          (varVal) => varVal.length === 0
        );

        // Check if there is error in the pricing and inventory of variants (i.e. no empty key value)
        for (const optionKey in allPossibleVariantsObject) {
          const currentVariant = allPossibleVariantsObject[optionKey];
          for (const variantKey in currentVariant) {
            if (
              currentVariant[variantKey] === undefined ||
              currentVariant[variantKey] === ''
            ) {
              variantPriceAndInventoryError = true;
            }
          }
        }

        if (variantNamesErrorVal) {
          setVariantNamesError(true);
        }
        if (variantsValuesError) {
          setVariantsValuesError(true);
        }
        if (variantPriceAndInventoryError) {
          setVariantPriceAndInventoryError(true);
        }
      }

      if (
        variantNamesErrorVal ||
        variantsValuesError ||
        variantPriceAndInventoryError
      ) {
        message.error('Please fix the errors below in order to save.');
        return;
      }

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
            productType,
            variantNames,
            variantsValues,
            allPossibleVariantsObject,
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
            productType,
            variantNames,
            variantsValues,
            allPossibleVariantsObject,
          },
        });

        message.success(`${product?.data?.addProduct?.title} has been added.`);
      }

      refetch();
      navigate(routes.admin.inventory);
    },
    [
      productType,
      variantNames,
      variantsValues,
      allPossibleVariantsObject,
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
      status,
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

  const masterNftLocks = mapProductLockedToMaster[productId ?? ''];

  const isTokenGatedProduct = !!masterNftLocks;

  // Show different form if it's a product with variant or simple product.
  const IS_PRODUCT_WITH_VARIANTS =
    productType === PRODUCT_TYPE.PRODUCT_WITH_VARIANT;

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
          required
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

      {!IS_PRODUCT_WITH_VARIANTS && (
        <ProductFormCard
          title="Pricing and inventory"
          text="Give your product a price."
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

      {IS_PRODUCT_WITH_VARIANTS && (
        <>
          <ProductFormCard
            title="Variants"
            text="Add variations of this product. Offer your customers different options for color, format, size, shape, etc."
          >
            {variantNamesError && (
              <Alert>Please fill all the option names.</Alert>
            )}

            {variantsValuesError && (
              <Alert>Please add at least one values per option.</Alert>
            )}

            <VariantsContentWrapper>
              {variantsValues.map((options, index) => (
                <div key={`option_${index}`}>
                  <OptionTitle>Option {index + 1}</OptionTitle>
                  <OptionInputs>
                    <div>
                      <Input
                        label="Name"
                        placeholder="Enter the option name"
                        value={variantNames[index]}
                        onChange={(event) =>
                          handleVariantNameChange(event, index)
                        }
                      />
                    </div>
                    <div>
                      <TagInput
                        label="Values (Comma separated)"
                        onChange={handleVariantsChange}
                        value={variantsValues[index]}
                        removeTag={handleRemoveTag}
                        variantIndex={index}
                        placeholder="Red, Green, Blue"
                        removeOption={handleRemoveOption}
                      />
                    </div>
                  </OptionInputs>
                </div>
              ))}

              <AddAnOptionBtnWrapper>
                <AddAnButton
                  secondary
                  type="button"
                  icon="add"
                  onClick={handleAddVariantOption}
                >
                  Add an option
                </AddAnButton>
              </AddAnOptionBtnWrapper>
            </VariantsContentWrapper>
          </ProductFormCard>

          <ProductFormCard
            title="Pricing and inventory"
            text="Give your products variants prices and inventory stocks."
          >
            {!!allPossibleVariants.length && (
              <>
                {variantPriceAndInventoryError && (
                  <Alert>
                    Please fill all the price and quantity for all variants.
                  </Alert>
                )}

                <VariantTableTitleWrapper>
                  <div>Variant</div>
                  <div>Price</div>
                  <div>Inventory</div>
                </VariantTableTitleWrapper>

                {allPossibleVariants.map((variation: string) => (
                  <VariationWrapper key={variation}>
                    <VariationInputsWrapper>
                      <VariationName>{variation}</VariationName>
                      <div style={{ width: '100%' }}>
                        <Input
                          value={allPossibleVariantsObject[variation]?.price}
                          onChange={(event) =>
                            handleVariationObjectChange({
                              event,
                              variation,
                              type: 'price',
                            })
                          }
                          type="number"
                          placeholder="Enter the price"
                          step={0.00000000001}
                          min={0}
                        />
                      </div>

                      <div style={{ width: '100%' }}>
                        <Input
                          value={allPossibleVariantsObject[variation]?.qty}
                          onChange={(event) =>
                            handleVariationObjectChange({
                              event,
                              variation,
                              type: 'qty',
                            })
                          }
                          type="number"
                          placeholder="Enter the inventory"
                          min={0}
                        />
                      </div>
                    </VariationInputsWrapper>
                  </VariationWrapper>
                ))}
              </>
            )}
          </ProductFormCard>
        </>
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
        <Button secondary to={-1}>
          Cancel
        </Button>

        <div>
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
        </div>
      </FormBtnWrapper>
    </FormWrapper>
  );
};
