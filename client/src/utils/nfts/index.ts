import { ConfirmedSignatureInfo, Connection, PublicKey } from '@solana/web3.js';
import { CLUSTER_ENDPOINT } from 'utils/cluster';
import { Metaplex, Nft, NftOriginalEdition } from '@metaplex-foundation/js';

export const getNftMetadata = async (
  nftAddress: string,
  userMetaplex?: any
) => {
  const connection = new Connection(CLUSTER_ENDPOINT);
  const metaplex = userMetaplex ?? new Metaplex(connection);

  // Get the nft edition data
  const mintAddress = new PublicKey(nftAddress);

  const originalNft = await metaplex.nfts().findByMint({ mintAddress }).run();

  return originalNft;
};

export const getPrintedVersionsFromMasterAddress = async (
  masterAddress: string
) => {
  const connection = new Connection(CLUSTER_ENDPOINT);
  const metaplex = new Metaplex(connection);

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
          hashlist.push(
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
