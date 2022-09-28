import { useQuery } from '@apollo/client';
import {
  UnstyledButton,
  Loader,
  Icon,
  Button,
  message,
} from 'components-library';
import { ProductPreviewItem } from 'components/product-preview';
import { useAuth } from 'hooks/auth';
import { useInventory } from 'hooks/inventory';
import { useNft } from 'hooks/nft';
import { FIND_NFT_BY_ADDRESS } from 'queries';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const ProductGrid = styled.div`
  display: grid;
  grid-gap: 40px 12px;
  margin: 0 auto;

  grid-template-columns: 1fr 1fr 1fr 1fr;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const SelectExclusivityBtn = styled(UnstyledButton)<{ isSelected: boolean }>`
  text-align: left;
  position: relative;
  flex-direction: column;
  padding: 8px;
  transition: 0.2s;
  border-radius: ${(p) => p.theme.borderRadius.default};

  background-color: ${(p) =>
    p.isSelected ? `${p.theme.color.primary}11` : 'transparent'};
`;

const SelectBadgeWrapper = styled.div<{ isSelected: boolean }>`
  position: absolute;
  bottom: 4px;
  right: 4px;
  color: ${(p) => (p.isSelected ? p.theme.color.primary : p.theme.color.text)};
  font-size: 24px;
`;

const SaveBtn = styled(Button)`
  margin-top: 40px;
  position: sticky;
  bottom: 20px;
`;

export const ExclusivitiesSelection = ({
  closeModal,
  refetchNftByAddress,
}: {
  closeModal: () => void;
  refetchNftByAddress: () => void;
}) => {
  const { address } = useParams();

  const {
    loading: currentNftIsLoading,
    data: currentNft,
    // refetch: refetchNftByAddress,
  } = useQuery(FIND_NFT_BY_ADDRESS, {
    variables: { nftAddress: address },
    notifyOnNetworkStatusChange: true,
  });

  const { updateNft, updateNftIsLoading } = useNft();

  const { inventory, isLoading } = useInventory();

  const { user, currencyDecimals } = useAuth();

  const [exclusivities, setExclusivities] = useState<string[]>([]);

  const handleProductClick = useCallback(
    (id: string) => {
      const exclusivitiesClone = [...exclusivities];

      const index = exclusivitiesClone.indexOf(id);
      if (index > -1) {
        exclusivitiesClone.splice(index, 1);
      } else {
        exclusivitiesClone.push(id);
      }
      setExclusivities(exclusivitiesClone);
    },
    [exclusivities]
  );

  const handleSave = useCallback(async () => {
    await updateNft({
      productsUnlocked: exclusivities,
      nftId: currentNft?.findNftByAddress?._id,
    });

    refetchNftByAddress();
    message.success('Exclusivities saved');
    closeModal();
  }, [
    updateNft,
    exclusivities,
    currentNft?.findNftByAddress?._id,
    refetchNftByAddress,
    closeModal,
  ]);

  useEffect(() => {
    setExclusivities(currentNft?.findNftByAddress?.productsUnlocked);
  }, [currentNft?.findNftByAddress?.productsUnlocked]);

  if (isLoading || currentNftIsLoading) {
    return <Loader />;
  }

  const productsCountText = `${exclusivities.length} product${
    exclusivities.length > 1 ? 's' : ''
  }`;

  return (
    <div>
      <ProductGrid>
        {inventory?.map(({ image, title, price, _id }) => {
          const isSelected = exclusivities.includes(_id);
          return (
            <SelectExclusivityBtn
              key={_id}
              onClick={() => handleProductClick(_id)}
              isSelected={isSelected}
            >
              <ProductPreviewItem
                image={image}
                title={title}
                priceDisplay={Number(price.toFixed(currencyDecimals))}
                currency={user?.currency}
              />

              <SelectBadgeWrapper isSelected={isSelected}>
                <Icon
                  name={isSelected ? 'check_box' : 'check_box_outline_blank'}
                />
              </SelectBadgeWrapper>
            </SelectExclusivityBtn>
          );
        })}
      </ProductGrid>

      <SaveBtn
        onClick={handleSave}
        isLoading={updateNftIsLoading}
        style={{ marginTop: '40px' }}
        fullWidth
      >
        Save changes ({productsCountText})
      </SaveBtn>
    </div>
  );
};
