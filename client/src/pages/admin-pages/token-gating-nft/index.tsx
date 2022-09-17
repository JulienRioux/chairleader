import { Nft } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import {
  Button,
  Icon,
  Loader,
  UnstyledButton,
  UnstyledExternalLink,
} from 'components-library';
import { useMetaplex } from 'hooks/metaplex';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { CLUSTER_ENV, formatShortAddress, routes } from 'utils';
import { DetailItem } from '../invoice-page';

const NftImg = styled.img`
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 1px solid ${(p) => p.theme.color.text}22;
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: 400px;
`;

const NftName = styled.div`
  font-weight: bold;
  margin: 4px 0;
  font-size: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const SolScanLink = styled(UnstyledExternalLink)`
  margin-bottom: 8px;
  padding: 4px;
  color: ${(p) => p.theme.color.primary};
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 2px solid ${(p) => p.theme.color.primary}22;
  display: inline-block;
`;

const Description = styled.p`
  color: ${(p) => p.theme.color.lightText};
`;

const DetailsWrapper = styled.div`
  width: 100%;
`;

const TokenGatingNftWrapper = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 60px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const TokenGateTypeTitle = styled.h3`
  margin: 0;
  font-size: 24px;
`;

const StyledButton = styled(Button)`
  font-size: 14px;
  padding: 8px 12px;
  margin-left: 20px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  justify-content: space-between;
`;

const ProductImg = styled.img`
  width: 100%;
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 1px solid ${(p) => p.theme.color.text}22;
  aspect-ratio: 1 / 1;
`;

const Scoller = styled.div`
  display: flex;
  gap: 20px;
  overflow: scroll;
  padding: 12px 0;
  border-top: 1px solid ${(p) => p.theme.color.text}22;
`;

const DealsWrapper = styled.div`
  overflow: scroll;
  margin-bottom: 80px;
`;

const DealTitle = styled.h4`
  margin: 8px 0 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const DealPrice = styled.div`
  margin: 8px 0 0;
  color: ${(p) => p.theme.color.primary};
`;

const DealItemButton = styled(UnstyledButton)`
  width: 200px;
  text-align: left;
`;

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

  const { connecting, publicKey } = useWallet();

  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [royalties, setRoyalties] = useState<any>();
  const [currentSupply, setCurrentSupply] = useState<any>();
  const [maxSupply, setMaxSupply] = useState<any>();
  const [externalUrl, setExternalUrl] = useState('');

  const loadNftData = useCallback(async () => {
    if (address && metaplex) {
      const mintAddress = new PublicKey(address);

      const nft = (await metaplex
        .nfts()
        .findByMint({ mintAddress })
        .run()) as Nft;

      setImage(nft?.json?.image ?? '');
      setName(nft?.json?.name ?? '');
      setDescription(nft?.json?.description ?? '');
      setRoyalties(Number(nft?.sellerFeeBasisPoints) / 100 ?? null);
      setExternalUrl(nft?.json?.external_url ?? '');

      if (nft.edition.isOriginal) {
        setMaxSupply(nft.edition.maxSupply);
        setCurrentSupply(nft.edition.supply);
      }
    }
  }, [address, metaplex]);

  useEffect(() => {
    loadNftData();
  }, [loadNftData]);

  if (connecting) {
    return <Loader />;
  }

  if (!publicKey) {
    return <p>Connect your wallet in order to see this page.</p>;
  }

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
        </DetailsWrapper>

        <div>
          <DealCarousel type="exclusivity" />

          <DealCarousel type="reward" />
        </div>
      </TokenGatingNftWrapper>
    </div>
  );
};
