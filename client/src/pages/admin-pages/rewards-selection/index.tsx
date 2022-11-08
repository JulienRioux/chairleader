import { useQuery } from '@apollo/client';
import { Loader, Button, message, Input, Checkbox } from 'components-library';
import { Label } from 'components-library/input/input.styles';
import { useNft } from 'hooks/nft';
import { FIND_NFT_BY_ADDRESS } from 'queries';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const DiscountTypeWrapper = styled.div`
  margin: 12px 0;
`;

const CheckboxAndBadgeWrapper = styled.div`
  display: flex;
`;

const Badge = styled.span`
  background: ${(p) => p.theme.color.text}11;
  color: ${(p) => p.theme.color.lightText};
  padding: 4px 8px;
  border-radius: ${(p) => p.theme.borderRadius.default};
  height: fit-content;
  font-size: 12px;
  margin: 1px 0 0 12px;
`;

export const RewardsSelection = ({
  closeModal,
  refetchNftByAddress,
}: {
  closeModal: () => void;
  refetchNftByAddress: () => void;
}) => {
  const [rewardType, setRewardType] = useState('percent_discount');
  const { address } = useParams();
  const [discountValue, setDiscountValue] = useState('');

  const { loading: currentNftIsLoading, data: currentNft } = useQuery(
    FIND_NFT_BY_ADDRESS,
    { variables: { nftAddress: address }, notifyOnNetworkStatusChange: true }
  );

  const { updateNft, updateNftIsLoading } = useNft();

  const handleSave = useCallback(
    async (e: any) => {
      e.preventDefault();
      await updateNft({
        rewardsUnlocked: [
          {
            type: rewardType,
            value: Number(discountValue),
          },
        ],
        nftId: currentNft?.findNftByAddress?._id,
      });

      refetchNftByAddress();

      message.success('Rewards saved');
      closeModal();
    },
    [
      closeModal,
      currentNft?.findNftByAddress?._id,
      discountValue,
      refetchNftByAddress,
      rewardType,
      updateNft,
    ]
  );

  const handleRemove = useCallback(async () => {
    await updateNft({
      rewardsUnlocked: [],
      nftId: currentNft?.findNftByAddress?._id,
    });

    refetchNftByAddress();

    message.success('Rewards removed.');
    closeModal();
  }, [
    closeModal,
    currentNft?.findNftByAddress?._id,
    refetchNftByAddress,
    updateNft,
  ]);

  useEffect(() => {
    setDiscountValue(
      currentNft?.findNftByAddress?.rewardsUnlocked[0]?.value ?? ''
    );
    setRewardType(
      currentNft?.findNftByAddress?.rewardsUnlocked[0]?.type ??
        'percent_discount'
    );
  }, [currentNft?.findNftByAddress?.rewardsUnlocked]);

  if (currentNftIsLoading) {
    return <Loader />;
  }

  return (
    <>
      <form onSubmit={handleSave}>
        <Label>Discount type</Label>
        <DiscountTypeWrapper>
          <Checkbox
            id="percent_discount"
            label="Precentage discount"
            onChange={(e) => setRewardType('percent_discount')}
            checked={rewardType === 'percent_discount'}
          />

          <CheckboxAndBadgeWrapper>
            <Checkbox
              id="amount_discount"
              label="Amount discount"
              onChange={(e) => setRewardType('amount_discount')}
              checked={rewardType === 'amount_discount'}
              disabled
            />

            <Badge>Coming soon</Badge>
          </CheckboxAndBadgeWrapper>
        </DiscountTypeWrapper>

        <Input
          label="Discount %"
          placeholder="Enter the discount"
          type="number"
          min={0}
          max={100}
          value={discountValue}
          onChange={(e) => setDiscountValue(e.target.value)}
          required
        />
        <Button type="submit" isLoading={updateNftIsLoading} fullWidth>
          Save changes
        </Button>
      </form>

      {currentNft?.findNftByAddress?.rewardsUnlocked[0] && !updateNftIsLoading && (
        <Button
          secondary
          isLoading={updateNftIsLoading}
          fullWidth
          onClick={handleRemove}
          style={{ marginTop: '8px' }}
        >
          Remove reward
        </Button>
      )}
    </>
  );
};
