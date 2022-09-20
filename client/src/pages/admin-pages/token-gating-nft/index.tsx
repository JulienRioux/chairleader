import { useWallet } from '@solana/wallet-adapter-react';
import { Button, Icon, Loader } from 'components-library';
import { useMetaplex } from 'hooks/metaplex';
import { usePrintedNftsEditions } from 'hooks/printed-nfts-editions';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CLUSTER_ENV,
  formatShortAddress,
  printNewNftEdition,
  getNftMetadata,
  routes,
} from 'utils';
import { DetailItem } from '../invoice-page';

import {
  DealItemButton,
  DealPrice,
  DealTitle,
  DealsWrapper,
  Scoller,
  ProductImg,
  TitleWrapper,
  StyledButton,
  TokenGateTypeTitle,
  TokenGatingNftWrapper,
  DetailsWrapper,
  Description,
  SolScanLink,
  NftName,
  NftImg,
} from './token-fating.nft.styles';

const DealItem = () => {
  return (
    <DealItemButton>
      <ProductImg src="https://dev-alt-gate-products.s3.amazonaws.com/products/62f40aa40c9249b03d773ec0-5ab8bc6c-3e2b-457c-87ef-e59239fde25b.webp" />
      <DealTitle>Caffè Misto</DealTitle>

      <DealPrice>2.5 USDC</DealPrice>
    </DealItemButton>
  );
};

type DealType = 'exclusivity' | 'reward';

const CAROUSEL_DETAILS = {
  exclusivity: {
    title: 'Exclusivities unlocked',
    button: 'Select exclusivities',
    link: '/exclusivities',
  },
  reward: {
    title: 'Rewards',
    button: 'Select rewards',
    link: '/rewards',
  },
};

const DealCarousel = ({ type }: { type: DealType }) => {
  const { address } = useParams();

  const { title, button, link } = CAROUSEL_DETAILS[type];

  return (
    <DealsWrapper>
      <TitleWrapper>
        <TokenGateTypeTitle>{title}</TokenGateTypeTitle>
        <StyledButton
          to={`${routes.admin.tokenGating}/${address}${link}`}
          secondary
        >
          {button}
        </StyledButton>
      </TitleWrapper>

      <Scoller>
        <DealItem />
      </Scoller>
    </DealsWrapper>
  );
};

export const TokenGatingNft = () => {
  const { metaplex } = useMetaplex();
  const { address } = useParams();

  const [showAll, setShowAll] = useState(false);

  const { connecting, publicKey } = useWallet();
  const [nftDataIsLoading, setNftDataIsLoading] = useState(false);

  const { editionsPrintedList, editionsPrintedListIsLoading } =
    usePrintedNftsEditions(address);

  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [royalties, setRoyalties] = useState<any>();
  const [currentSupply, setCurrentSupply] = useState<any>();
  const [maxSupply, setMaxSupply] = useState<any>();
  const [externalUrl, setExternalUrl] = useState('');

  const loadNftData = useCallback(async () => {
    if (address && metaplex) {
      setNftDataIsLoading(true);
      const nft = await getNftMetadata(address);

      setImage(nft?.json?.image ?? '');
      setName(nft?.json?.name ?? '');
      setDescription(nft?.json?.description ?? '');
      setRoyalties(Number(nft?.sellerFeeBasisPoints) / 100 ?? null);
      setExternalUrl(nft?.json?.external_url ?? '');

      if (nft.edition.isOriginal) {
        setMaxSupply(nft.edition.maxSupply);
        setCurrentSupply(nft.edition.supply);
      }
      setNftDataIsLoading(false);
    }
  }, [address, metaplex]);

  const handlePrintNewEdition = useCallback(async () => {
    if (!address) {
      return;
    }
    const printedNft = await printNewNftEdition({
      originalNftAddress: address,
      metaplex,
    });
    console.log('printedNft', printedNft);
  }, [address, metaplex]);

  useEffect(() => {
    // Load the NFT metadata
    loadNftData();
  }, [loadNftData]);

  if (connecting || nftDataIsLoading) {
    return <Loader />;
  }

  if (!publicKey) {
    return <p>Connect your wallet in order to see this page.</p>;
  }

  const printedAddresses = showAll
    ? editionsPrintedList
    : editionsPrintedList.slice(0, 5);

  const hasMorePrintedNfts = editionsPrintedList.length > 5;

  return (
    <div>
      <div>
        <SolScanLink
          href={`https://solscan.io/token/${address}?cluster=${CLUSTER_ENV}`}
          target="_blank"
        >
          {formatShortAddress(address)}
          <Icon name="launch" style={{ marginLeft: '8px' }} />
        </SolScanLink>
      </div>
      <TokenGatingNftWrapper>
        <DetailsWrapper>
          <NftImg {...(image && { src: image })} />

          <NftName>{name}</NftName>

          <Description>{description}</Description>

          <DetailItem label="Editions">{`${currentSupply} minted of maximum ${maxSupply}`}</DetailItem>

          <DetailItem label="External Link">
            {externalUrl ? (
              <a href={externalUrl} target="_blank" rel="noreferrer">
                {externalUrl}
              </a>
            ) : (
              '-'
            )}
          </DetailItem>

          <DetailItem label="Royalty">{royalties}%</DetailItem>

          <Button
            fullWidth
            secondary
            style={{ margin: '20px 0' }}
            onClick={handlePrintNewEdition}
          >
            Print new edition
          </Button>

          <h4>Printed token address:</h4>

          {editionsPrintedListIsLoading && <p>Loading...</p>}

          {!editionsPrintedListIsLoading && (
            <>
              {printedAddresses.map((printedNftAddress) => (
                <SolScanLink
                  href={`https://solscan.io/token/${printedNftAddress}?cluster=${CLUSTER_ENV}`}
                  target="_blank"
                  key={printedNftAddress}
                  style={{ margin: '0 8px 4px 0' }}
                >
                  {formatShortAddress(printedNftAddress)}
                  <Icon name="launch" style={{ marginLeft: '8px' }} />
                </SolScanLink>
              ))}

              {!showAll && hasMorePrintedNfts && (
                <Button
                  onClick={() => setShowAll(true)}
                  secondary
                  style={{ padding: '4px' }}
                >
                  Show more
                </Button>
              )}
            </>
          )}
        </DetailsWrapper>

        <div>
          <DealCarousel type="exclusivity" />

          <DealCarousel type="reward" />
        </div>
      </TokenGatingNftWrapper>
    </div>
  );
};
