import {
  ConfirmedSignatureInfo,
  Connection,
  Keypair,
  PublicKey,
} from '@solana/web3.js';
import { CLUSTER_ENDPOINT } from 'utils/cluster';
import {
  bundlrStorage,
  JsonMetadata,
  keypairIdentity,
  Metadata,
  Metaplex,
  MetaplexPlugin,
  Nft,
  NftOriginalEdition,
} from '@metaplex-foundation/js';
import bs58 from 'bs58';
import { NFT_FILE_UPLOADER, IFILE_UPLOADER, IS_DEV } from 'configs';
import { nftStorage } from '@metaplex-foundation/js-plugin-nft-storage';

export const getNftMetadata = async (
  nftAddress: string,
  userMetaplex?: any
) => {
  const metaplex = userMetaplex ?? getUnauthenticatedMetaplex();

  // Get the nft edition data
  const mintAddress = new PublicKey(nftAddress);

  const originalNft = await metaplex.nfts().findByMint({ mintAddress }).run();

  return originalNft;
};

export const getUnauthenticatedMetaplex = () => {
  const connection = new Connection(CLUSTER_ENDPOINT);
  return new Metaplex(connection);
};

export const getPrintedVersionsFromMasterAddress = async (
  masterAddress: string
) => {
  const metaplex = getUnauthenticatedMetaplex();

  const originalNft = await getNftMetadata(masterAddress, metaplex);

  const originalNftEditionAddress = (
    (originalNft as Nft).edition as NftOriginalEdition
  ).address;

  // Paginate transactions from Master Edition
  const signatures: ConfirmedSignatureInfo[] =
    await metaplex.connection.getSignaturesForAddress(
      originalNftEditionAddress,
      {},
      'finalized'
    );

  // Parse Transactions and find new edition mints
  const hashlist: string[] = [];
  for (let i = 0; i < signatures.length; i++) {
    await metaplex.connection
      .getParsedTransaction(signatures[i].signature)
      .then((tx) => {
        if (!tx) return;

        if (JSON.stringify(tx).toLowerCase().includes('error')) return;

        if (
          JSON.stringify(tx).includes('Mint New Edition from Master Edition')
        ) {
          hashlist.unshift(
            tx.transaction.message.accountKeys[1].pubkey.toString()
          );
        }
      });
  }

  return hashlist;
};

export const printNewNftEdition = async ({
  originalNftAddress,
  metaplex,
}: {
  originalNftAddress: string;
  metaplex: any;
}) => {
  await getNftMetadata(originalNftAddress);

  if (!metaplex) {
    return;
  }
  const mintAddress = new PublicKey(originalNftAddress);

  const originalNft = await metaplex.nfts().findByMint({ mintAddress }).run();

  // Check if it's an original
  console.log('originalNft', originalNft);

  // Make the new print
  const { nft: printedNft } = await metaplex
    .nfts()
    .printNewEdition({ originalMint: mintAddress })
    .run();

  return printedNft;
};

export const ADMIN_PAYER_ADDRESS = Keypair.fromSecretKey(
  bs58.decode(process.env.REACT_APP_NFT_CREATOR_SECRET_KEY ?? '')
);

export const getAdminMetaplex = () => {
  const secretKey = bs58.decode(
    process.env.REACT_APP_NFT_CREATOR_SECRET_KEY ?? ''
  );

  const myKeyPair = Keypair.fromSecretKey(secretKey);

  const connection = new Connection(CLUSTER_ENDPOINT);

  if (NFT_FILE_UPLOADER === IFILE_UPLOADER.NFT_STORAGE) {
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(myKeyPair))
      .use(
        nftStorage({
          token: process.env.REACT_APP_NFT_STORAGE_API_KEY,
        }) as unknown as MetaplexPlugin
      );
    return metaplex;
  } else {
    const BUNDLR_STORAGE = IS_DEV
      ? bundlrStorage({
          address: 'https://devnet.bundlr.network',
          providerUrl: CLUSTER_ENDPOINT,
          timeout: 60000,
        })
      : bundlrStorage();

    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(myKeyPair))
      .use(BUNDLR_STORAGE);

    return metaplex;
  }
};

export const printNewNftEditionWithoutFees = async ({
  originalNftAddress,
  newOwnerPublicKey,
}: {
  originalNftAddress: string;
  newOwnerPublicKey: any;
}) => {
  await getNftMetadata(originalNftAddress);

  const adminMetaplex = getAdminMetaplex();

  const mintAddress = new PublicKey(originalNftAddress);

  // Make the new print
  const { nft: printedNft } = await adminMetaplex
    .nfts()
    .printNewEdition({
      originalMint: mintAddress,
      newOwner: newOwnerPublicKey,
    })
    .run();

  return printedNft;
};

export const getNftDataFromAddressArr = async (nftAddressArr: string[]) => {
  if (!nftAddressArr) {
    return [];
  }

  const metaplex = getUnauthenticatedMetaplex();

  const nfts = await metaplex
    .nfts()
    .findAllByMintList({
      mints: nftAddressArr.map((nftAddress) => new PublicKey(nftAddress)),
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

  return populatedNfts;
};
