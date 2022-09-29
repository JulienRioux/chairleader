import { useMutation, useQuery } from '@apollo/client';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import {
  getAssociatedTokenAddress,
  getMint,
  getAccount,
  createTransferCheckedInstruction,
} from '@solana/spl-token';
import {
  Button,
  Icon,
  Loader,
  message,
  UnstyledExternalLink,
  useModal,
} from 'components-library';
import { useAuth } from 'hooks/auth';
import { useCurrency } from 'hooks/currency';
import { useInventory } from 'hooks/inventory';
import { useMetaplex } from 'hooks/metaplex';
import { useNft } from 'hooks/nft';
import { usePrintedNftsEditions } from 'hooks/printed-nfts-editions';
import { useStore } from 'hooks/store';
import { FIND_NFT_BY_ADDRESS, SAVE_TRANSACTION_INVOICE } from 'queries';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CLUSTER_ENV,
  formatShortAddress,
  printNewNftEditionWithoutFees,
  getNftMetadata,
  Logger,
  routes,
  DEVNET_DUMMY_MINT,
  createSPLTokenInstruction,
} from 'utils';
import { ExclusivitiesSelection } from '../exclusitivies-selection';
import { DetailItem } from '../invoice-page';
import { useStoreLink } from '../point-of-sale-page';

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
  EditionNumber,
  NftName,
  NftImg,
  RightWrapper,
} from './token-gating.nft.styles';
import { useCart } from 'hooks/cart';
import { PAYMENT_SERVICE_FEE, SELLING_NFT_SERVICE_FEE } from 'configs';

const DealItem = ({
  productId,
  isAdminApp,
}: {
  productId: string;
  isAdminApp: boolean;
}) => {
  const { inventory: adminApp } = useInventory();
  const { user } = useAuth();

  const { inventory: storeApp } = useStore();
  const { currency: storeAppCurrency } = useCurrency();

  const [inventory, currency] = isAdminApp
    ? [adminApp, user?.currency]
    : [storeApp, storeAppCurrency];

  const currentProduct = inventory.find(({ _id }) => _id === productId);

  return (
    <DealItemButton>
      <ProductImg src={currentProduct?.image} />
      <DealTitle>{currentProduct?.title}</DealTitle>

      <DealPrice>
        {currentProduct?.price} {currency}
      </DealPrice>
    </DealItemButton>
  );
};

export const useSplTokenPayent = () => {
  const { sendTransaction, publicKey } = useWallet();
  const { connection } = useConnection();
  const navigate = useNavigate();

  const { getCartSummaryForInvoice, resetCart } = useCart();

  const [saveTransactionInvoice] = useMutation(SAVE_TRANSACTION_INVOICE);

  const { currency, network } = useCurrency();

  const { store, refetchInventory } = useStore();

  const makePayment = useCallback(
    async ({ amount, isNft }: { amount: number; isNft?: boolean }) => {
      try {
        // Creating a new transaction
        const transaction = new Transaction();

        // Setting up the differents recipient amount
        const totalAmount = Number(amount);

        const payeePublicKey =
          process.env.REACT_APP_TRANSACTION_PAYEE_PUBLIC_KEY;

        if (!payeePublicKey || !publicKey) {
          return;
        }

        const mint = await getMint(connection, DEVNET_DUMMY_MINT);

        const SERVICE_FEE = isNft
          ? SELLING_NFT_SERVICE_FEE
          : PAYMENT_SERVICE_FEE;

        const servicePayout = Number(
          (totalAmount * (SERVICE_FEE / 100))?.toFixed(mint.decimals)
        );

        const recipientPayout = totalAmount - servicePayout;

        const paymentInstructions = await createSPLTokenInstruction({
          recipient: new PublicKey(payeePublicKey),
          amount: new BigNumber(recipientPayout),
          splToken: DEVNET_DUMMY_MINT,
          sender: publicKey,
          connection,
        });

        // Adding the payment instruction to the current transaction
        transaction.add(paymentInstructions);

        const intermediaryAccount =
          process.env.REACT_APP_TRANSACTION_PAYEE_PUBLIC_KEY ?? '';

        // Fees instructions
        const feesInstructions = await createSPLTokenInstruction({
          recipient: new PublicKey(intermediaryAccount),
          amount: new BigNumber(servicePayout),
          splToken: DEVNET_DUMMY_MINT,
          sender: publicKey,
          connection,
        });

        // Adding the instruction to the current transaction
        transaction.add(feesInstructions);

        // Getting the latest block hash
        const {
          context: { slot: minContextSlot },
          value: { blockhash, lastValidBlockHeight },
        } = await connection.getLatestBlockhashAndContext();

        transaction.recentBlockhash = blockhash;

        // Setting up the feePayer
        transaction.feePayer = publicKey;

        const signature = await sendTransaction(transaction, connection, {
          minContextSlot,
        });

        await connection.confirmTransaction({
          blockhash,
          lastValidBlockHeight,
          signature,
        });

        if (isNft) {
          // Do something here to save the Invoice
          return;
        }

        // Saving the invoice in out DB
        const cartSummary = getCartSummaryForInvoice();

        const newInvoice = await saveTransactionInvoice({
          variables: {
            ...cartSummary,
            signature,
            customerWalletAddress: publicKey.toString(),
            storeId: store?._id,
            currency,
            network,
            serviceFees: servicePayout,
          },
        });

        // Resetting the cart items and redirect to the confirmation page
        resetCart();
        // Make sure we're updating the qty after the purchase
        refetchInventory();

        navigate(
          `${routes.store.confirmation}/${newInvoice?.data?.saveTransactionInvoice?._id}/tx/${newInvoice?.data?.saveTransactionInvoice?.signature}`
        );
      } catch (err) {
        // err handle
        Logger.error(err);
        message.error();
        throw err;
      }
    },
    [
      connection,
      currency,
      getCartSummaryForInvoice,
      navigate,
      network,
      publicKey,
      refetchInventory,
      resetCart,
      saveTransactionInvoice,
      sendTransaction,
      store?._id,
    ]
  );

  return { makePayment };
};

const ExclusivitiesCarousel = ({
  productsUnlocked,
  refetchNftByAddress,
  isAdminApp,
}: {
  productsUnlocked?: string[];
  refetchNftByAddress: () => void;
  isAdminApp: boolean;
}) => {
  const { Modal, openModal, closeModal } = useModal();

  return (
    <DealsWrapper>
      <TitleWrapper>
        <TokenGateTypeTitle>
          <Icon name="lock_open" /> Exclusivities unlocked
        </TokenGateTypeTitle>
        {isAdminApp && (
          <StyledButton secondary onClick={openModal}>
            Select exclusivities
          </StyledButton>
        )}
      </TitleWrapper>

      <Scoller>
        {productsUnlocked?.map((productId) => (
          <DealItem
            key={productId}
            productId={productId}
            isAdminApp={isAdminApp}
          />
        ))}
      </Scoller>

      {!productsUnlocked?.length && <p>No exclusivities yet.</p>}

      <Modal title="Select exclusive products" isMaxWidth>
        <ExclusivitiesSelection
          closeModal={closeModal}
          refetchNftByAddress={refetchNftByAddress}
        />
      </Modal>
    </DealsWrapper>
  );
};

export const TokenGatingNft = ({
  isAdminApp = false,
}: {
  isAdminApp?: boolean;
}) => {
  const { metaplex } = useMetaplex();
  const { address } = useParams();

  const [showAll, setShowAll] = useState(false);

  const { connecting, publicKey } = useWallet();
  const [nftDataIsLoading, setNftDataIsLoading] = useState(false);

  const {
    loading: currentNftIsLoading,
    data: currentNft,
    refetch: refetchNftByAddress,
  } = useQuery(FIND_NFT_BY_ADDRESS, {
    variables: { nftAddress: address },
    notifyOnNetworkStatusChange: true,
  });

  const {
    editionsPrintedList,
    editionsPrintedListIsLoading,
    refreshEditionsPrintedList,
  } = usePrintedNftsEditions(address);

  const {
    refreshUserNfts,
    refreshProductLockedMap,
    updateNft,
    updateNftIsLoading,
  } = useNft();

  const { makePayment } = useSplTokenPayent();

  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [royalties, setRoyalties] = useState<any>();
  const [currentSupply, setCurrentSupply] = useState<any>();
  const [maxSupply, setMaxSupply] = useState<any>();
  const [externalUrl, setExternalUrl] = useState('');
  const [price, setPrice] = useState('');

  const [printNftIsLoading, setPrintNftIsLoading] = useState(false);

  const storeLink = useStoreLink();

  const loadNftData = useCallback(async () => {
    if (address && metaplex) {
      setNftDataIsLoading(true);
      const nft = await getNftMetadata(address);

      setImage(nft?.json?.image ?? '');
      setName(nft?.json?.name ?? '');
      setDescription(nft?.json?.description ?? '');
      setRoyalties(Number(nft?.sellerFeeBasisPoints) / 100 ?? null);
      setExternalUrl(nft?.json?.external_url ?? '');
      setPrice(nft?.json?.initialPrice ?? '');

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

    setPrintNftIsLoading(true);

    const identity = metaplex?.identity();
    const newOwnerPublicKey = identity ? identity.publicKey : null;

    if (!newOwnerPublicKey) {
      return;
    }

    try {
      await makePayment({ amount: Number(price), isNft: true });

      message.success('Payment succeed.');

      await printNewNftEditionWithoutFees({
        originalNftAddress: address,
        newOwnerPublicKey,
      });

      setPrintNftIsLoading(false);

      loadNftData();
      refreshEditionsPrintedList();
      refreshUserNfts();

      refreshProductLockedMap();

      message.success('NFT added successfully.');
    } catch (err) {
      Logger.error(err);
      setPrintNftIsLoading(false);
    }
  }, [
    address,
    metaplex,
    makePayment,
    price,
    loadNftData,
    refreshEditionsPrintedList,
    refreshUserNfts,
    refreshProductLockedMap,
  ]);

  const handleIsArchiveChange = useCallback(async () => {
    await updateNft({
      nftId: currentNft?.findNftByAddress?._id,
      isArchived: !currentNft?.findNftByAddress?.isArchived,
    });
    await refetchNftByAddress();
    message.success('Archive status changed.');
  }, [
    currentNft?.findNftByAddress?._id,
    currentNft?.findNftByAddress?.isArchived,
    refetchNftByAddress,
    updateNft,
  ]);

  useEffect(() => {
    // Load the NFT metadata
    loadNftData();
  }, [loadNftData]);

  if (connecting) {
    return (
      <div>
        <Loader />
        <p style={{ textAlign: 'center' }}>Connecting to wallet</p>
      </div>
    );
  }

  if (nftDataIsLoading) {
    return <Loader />;
  }

  if (!publicKey) {
    return <p>Connect your wallet in order to see this page.</p>;
  }

  const printedAddresses = showAll
    ? editionsPrintedList
    : editionsPrintedList.slice(0, 5);

  const hasMorePrintedNfts = editionsPrintedList.length > 5;

  const nftIsArchived = currentNft?.findNftByAddress?.isArchived;

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

          <DetailItem label="Price">{price} USDC</DetailItem>

          {isAdminApp && (
            <UnstyledExternalLink
              href={`${storeLink}${routes.store.nfts}/${address}`}
              target="_blank"
            >
              <Button
                fullWidth
                secondary
                style={{ margin: '20px 0' }}
                icon="launch"
              >
                See in store
              </Button>
            </UnstyledExternalLink>
          )}

          {!isAdminApp && (
            <Button
              fullWidth
              style={{ margin: '20px 0' }}
              onClick={handlePrintNewEdition}
              isLoading={printNftIsLoading}
            >
              Buy now
            </Button>
          )}

          {isAdminApp && (
            <>
              <h4>Printed token address:</h4>

              {editionsPrintedListIsLoading && <p>Loading...</p>}

              {!editionsPrintedListIsLoading && (
                <>
                  {printedAddresses.map((printedNftAddress, i) => (
                    <SolScanLink
                      href={`https://solscan.io/token/${printedNftAddress}?cluster=${CLUSTER_ENV}`}
                      target="_blank"
                      key={printedNftAddress}
                      style={{ margin: '0 8px 4px 0' }}
                    >
                      <span>{formatShortAddress(printedNftAddress)}</span>
                      <EditionNumber>
                        (Edition #{i + 1}/{editionsPrintedList.length})
                      </EditionNumber>

                      <Icon name="launch" style={{ marginLeft: '8px' }} />
                    </SolScanLink>
                  ))}

                  {!showAll && hasMorePrintedNfts && (
                    <div>
                      <Button
                        onClick={() => setShowAll(true)}
                        secondary
                        style={{ padding: '4px' }}
                      >
                        Show more
                      </Button>
                    </div>
                  )}

                  {printedAddresses.length === 0 && (
                    <p>No printed token yet.</p>
                  )}
                </>
              )}

              <div style={{ marginTop: '20px' }}>
                <Button
                  fullWidth
                  danger
                  onClick={handleIsArchiveChange}
                  isLoading={updateNftIsLoading}
                >
                  {nftIsArchived ? 'Unarchive NFT' : 'Archive NFT'}
                </Button>
              </div>
            </>
          )}
        </DetailsWrapper>

        <RightWrapper>
          {currentNftIsLoading ? (
            <div>
              <Loader />
              <div>Loading exclusivities</div>
            </div>
          ) : (
            <ExclusivitiesCarousel
              productsUnlocked={currentNft?.findNftByAddress?.productsUnlocked}
              refetchNftByAddress={refetchNftByAddress}
              isAdminApp={isAdminApp}
            />
          )}
        </RightWrapper>
      </TokenGatingNftWrapper>
    </div>
  );
};
