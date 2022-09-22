import { Loader, UnstyledLink } from 'components-library';
import { useCallback, useEffect, useState } from 'react';
import { JsonMetadata, Metadata, Nft } from '@metaplex-foundation/js';
import { useMetaplex } from 'hooks/metaplex';
import { PublicKey } from '@solana/web3.js';
import styled from 'styled-components';
import { formatShortAddress, routes } from 'utils';
import { useAuth } from 'hooks/auth';

const TEST_NFT_ADDRESSES = [
  'FPXX6oCHjDpRDLAqSYc9WDAACoPdixhBuWfqgLp5K336',
  'FzYyQgf1uZGmW6ELqL6ofWY9pH2M1GKzvG3Jw6CJkGCg',
  'FjwwrNsKxAQHodZ4fon7BorvQkxACfYAftxhrcJLm56b',
  'zFJ4Za9VX7Tu9mxz8FVZgYJsSf2Qm5byXPjCtvWCwDp',
];

const NftDisplayWrapper = styled.div`
  width: 100%;
`;

const NftImg = styled.img`
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 1px solid ${(p) => p.theme.color.text}22;
  width: 100%;
  aspect-ratio: 1 / 1;
`;

const NftsListWrapper = styled.div`
  margin: 20px 0;
  display: grid;
  gap: 20px;

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

const RewardsOrExclusivity = styled.div`
  color: ${(p) => p.theme.color.primary};
  margin: 8px 0 8px;
`;

const NftName = styled.div`
  font-weight: bold;
  margin: 4px 0;
  font-size: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Address = styled.div`
  font-size: 14px;
  color: ${(p) => p.theme.color.lightText};
`;

const NftDisplay = ({
  image,
  address,
  name,
}: {
  image: string;
  address: string;
  name: string;
}) => {
  return (
    <UnstyledLink to={`${routes.admin.tokenGating}/${address}`}>
      <NftDisplayWrapper>
        <NftImg {...(image && { src: image })} />

        <NftName>{name}</NftName>

        <RewardsOrExclusivity>
          No rewards or exclusivity yet.
        </RewardsOrExclusivity>

        <Address>{formatShortAddress(address)}</Address>
      </NftDisplayWrapper>
    </UnstyledLink>
  );
};

export const NftsList = () => {
  const { metaplex } = useMetaplex();

  const { user, isLoading: isLoadingUser } = useAuth();

  const [storeNfts, setStoreNfts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const findNftByAddress = useCallback(async () => {
    if (!metaplex) {
      return;
    }
    if (!user?.nfts) {
      return;
    }

    setIsLoading(true);
    const nfts = await metaplex
      .nfts()
      .findAllByMintList({
        mints: user.nfts.map((address: string) => new PublicKey(address)),
      })
      .run();

    const populatedNfts = await Promise.all(
      nfts.map(async (nft) => {
        if (!nft) {
          return;
        }
        const populatedNft = await metaplex
          .nfts()
          .load({ metadata: nft as Metadata<JsonMetadata<string>> })
          .run();

        return populatedNft;
      }, [])
    );

    setStoreNfts(populatedNfts);
    setIsLoading(false);
  }, [metaplex, user?.nfts]);

  useEffect(() => {
    findNftByAddress();
  }, [findNftByAddress]);

  return (
    <NftsListWrapper>
      {storeNfts.map(({ address, json: { image, name } }) => (
        <NftDisplay
          key={address.toBase58()}
          image={image}
          address={address.toBase58()}
          name={name}
        />
      ))}

      {(isLoading || isLoadingUser) && <Loader />}
    </NftsListWrapper>
  );
};
