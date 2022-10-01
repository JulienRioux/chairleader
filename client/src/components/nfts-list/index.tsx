import { Collapsible, Loader, UnstyledLink } from 'components-library';
import { useCallback, useEffect, useState } from 'react';
import { useMetaplex } from 'hooks/metaplex';
import styled from 'styled-components';
import { formatShortAddress, getNftDataFromAddressArr, routes } from 'utils';
import { useAuth } from 'hooks/auth';
import { useNft } from 'hooks/nft';
import { NftOwnerBadge } from 'pages/pos-app/product-page';
import { NftImgWrapper } from 'pages/admin-pages/token-gating-nft';

const NftDisplayWrapper = styled.div`
  width: 100%;
`;

const NftImg = styled.img`
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 1px solid ${(p) => p.theme.color.text}22;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
`;

const NftsListWrapper = styled.div`
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
  color: ${(p) => p.theme.color.lightText};
  margin: 8px 0 8px;
  font-size: 14px;
`;

const NftName = styled.div`
  font-weight: bold;
  margin: 8px 0;
  font-size: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const Price = styled.div`
  color: ${(p) => p.theme.color.primary};
  font-size: 18px;
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
  const { nftAddressWithProductsLocked, checkIfUserHasPrintedVersion } =
    useNft();

  const productsLocked = nftAddressWithProductsLocked[address];

  const numOfProductsLocked = productsLocked?.length;

  const exclusivitiesText = numOfProductsLocked
    ? `${numOfProductsLocked} exclusivit${
        numOfProductsLocked > 1 ? 'ies' : 'y'
      }`
    : 'No exclusivity yet.';

  const hasNftPrintedVersion = checkIfUserHasPrintedVersion(address);

  return (
    <UnstyledLink
      to={`${
        isStoreApp ? routes.store.nfts : routes.admin.tokenGating
      }/${address}`}
    >
      <NftDisplayWrapper>
        <NftImgWrapper>
          <NftImg {...(image && { src: image })} />
          {hasNftPrintedVersion && <NftOwnerBadge />}
        </NftImgWrapper>

        <NftName>{name}</NftName>

        <Price>{price} USDC</Price>

        <RewardsOrExclusivity>{exclusivitiesText}</RewardsOrExclusivity>
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

      {!isStoreApp && !!archivedNfts.length && (
        <div style={{ marginTop: '40px' }}>
          <Collapsible title={`Archived NFTs (${archivedNfts.length})`}>
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
