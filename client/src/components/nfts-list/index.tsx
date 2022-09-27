import { Collapsible, Loader, UnstyledLink } from 'components-library';
import { useCallback, useEffect, useState } from 'react';
import { useMetaplex } from 'hooks/metaplex';
import styled from 'styled-components';
import { formatShortAddress, getNftDataFromAddressArr, routes } from 'utils';
import { useAuth } from 'hooks/auth';
import { useNft } from 'hooks/nft';

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

export const Price = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  border: 1px solid ${(p) => p.theme.color.primary};
  color: ${(p) => p.theme.color.primary};
  background-color: ${(p) => p.theme.color.background};
  padding: 2px 4px;
  border-radius: ${(p) => p.theme.borderRadius.default};
`;

const NftDisplay = ({
  image,
  address,
  name,
  isStoreApp,
  price,
}: {
  image: string;
  address: string;
  name: string;
  isStoreApp?: boolean;
  price: boolean;
}) => {
  const { nftAddressWithProductsLocked } = useNft();

  const productsLocked = nftAddressWithProductsLocked[address];

  const numOfProductsLocked = productsLocked?.length;

  const exclusivitiesText = numOfProductsLocked
    ? `${numOfProductsLocked} exclusivit${
        numOfProductsLocked > 1 ? 'ies' : 'y'
      }`
    : 'No exclusivity yet.';

  return (
    <UnstyledLink
      to={`${
        isStoreApp ? routes.store.nfts : routes.admin.tokenGating
      }/${address}`}
    >
      <NftDisplayWrapper>
        <div style={{ position: 'relative' }}>
          <NftImg {...(image && { src: image })} />
          <Price>{price} USDC</Price>
        </div>

        <NftName>{name}</NftName>

        <RewardsOrExclusivity>{exclusivitiesText}</RewardsOrExclusivity>

        <Address>{formatShortAddress(address)}</Address>
      </NftDisplayWrapper>
    </UnstyledLink>
  );
};

export const NftsList = ({ isStoreApp = false }: { isStoreApp?: boolean }) => {
  const { metaplex } = useMetaplex();

  const { isLoading: isLoadingUser } = useAuth();

  const [storeNfts, setStoreNfts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { storeNfts: storeNftsFromDb } = useNft();

  const findNftByAddress = useCallback(async () => {
    if (!metaplex) {
      return;
    }
    if (!storeNftsFromDb) {
      return;
    }

    setIsLoading(true);

    const populatedNfts = await getNftDataFromAddressArr(
      storeNftsFromDb?.findNftsByStoreId.map(
        ({ nftAddress }: { nftAddress: string }) => nftAddress
      )
    );

    const populatedNftsWithDbData = populatedNfts.map((nft) => {
      const dataFromBd = storeNftsFromDb?.findNftsByStoreId.find(
        ({ nftAddress }: { nftAddress: string }) =>
          nftAddress === nft?.address?.toBase58()
      );
      return { ...nft, ...dataFromBd };
    });

    setStoreNfts(populatedNftsWithDbData);
    setIsLoading(false);
  }, [metaplex, storeNftsFromDb]);

  useEffect(() => {
    findNftByAddress();
  }, [findNftByAddress]);

  if (isLoading || isLoadingUser) {
    return <Loader />;
  }

  const activeNfts = storeNfts?.filter(
    ({ isArchived }: { isArchived: boolean }) => !isArchived
  );

  const archivedNfts = storeNfts?.filter(
    ({ isArchived }: { isArchived: boolean }) => isArchived
  );

  return (
    <div>
      <NftsListWrapper>
        {activeNfts.map((nft) => (
          <NftDisplay
            key={nft?.address?.toBase58()}
            image={nft?.json?.image}
            address={nft?.address?.toBase58()}
            name={nft?.json?.name}
            isStoreApp={isStoreApp}
            price={nft?.json?.initialPrice}
          />
        ))}

        {!storeNfts.length && !isLoading && !isLoadingUser && (
          <p>No NFT yet.</p>
        )}
      </NftsListWrapper>

      {!isStoreApp && archivedNfts.length && (
        <div style={{ marginTop: '40px' }}>
          <Collapsible title="Archived NFTs">
            <NftsListWrapper>
              {archivedNfts.map((nft) => (
                <NftDisplay
                  key={nft?.address?.toBase58()}
                  image={nft?.json?.image}
                  address={nft?.address?.toBase58()}
                  name={nft?.json?.name}
                  isStoreApp={isStoreApp}
                  price={nft?.json?.initialPrice}
                />
              ))}
            </NftsListWrapper>
          </Collapsible>
        </div>
      )}
    </div>
  );
};
