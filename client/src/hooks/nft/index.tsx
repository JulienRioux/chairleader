import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import * as React from 'react';
import { IBaseProps } from 'types';
import { useMetaplex } from 'hooks/metaplex';
import { useWallet } from '@solana/wallet-adapter-react';
import { getPrintedVersionsFromMasterAddress, Logger } from 'utils';
import {
  JsonMetadata,
  Metadata,
  Nft,
  NftPrintEdition,
} from '@metaplex-foundation/js';
import { FIND_NFT_BY_STORE_ID } from 'queries';
import { useQuery } from '@apollo/client';

export interface INftContext {
  userNftsIsLoading: boolean;
  userNfts: string[];
  productsLockedWithNftAddress: any;
}

export async function asyncForEach<T>(
  array: Array<T>,
  callback: (item: T, index: number) => Promise<void>
) {
  for (let index = 0; index < array?.length; index++) {
    await callback(array[index], index);
  }
}

export const NftContext = createContext<INftContext>({} as INftContext);

export const NftProvider: React.FC<IBaseProps> = ({ children }) => {
  const { metaplex } = useMetaplex();
  const { publicKey } = useWallet();
  const [userNfts, setUserNfts] = useState<string[]>([]);
  const [userNftsIsLoading, setUserNftsIsLoading] = useState(false);
  const [productsLockedWithNftAddress, setProductsLockedWithNftAddress] =
    useState<any>({});

  const { loading: storeNftsAreLoading, data: storeNfts } =
    useQuery(FIND_NFT_BY_STORE_ID);

  const getUserNfts = useCallback(async () => {
    if (!metaplex || !publicKey) {
      setUserNfts([]);
      return;
    }
    try {
      setUserNftsIsLoading(true);

      const walletNfts = await metaplex
        .nfts()
        .findAllByOwner({
          owner: publicKey,
        })
        .run();

      const populatedNfts = await Promise.all(
        walletNfts.map(async (nft) => {
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

      // populatedNfts.forEach((nft) => {
      //   console.log(
      //     'Parent:',
      //     ((nft as Nft).edition as NftPrintEdition)?.parent?.toBase58()
      //   );
      // });

      // console.log('populatedNfts', JSON.stringify(populatedNfts, null, 2));

      // console.log('walletNfts', walletNfts[0]);

      const nftsAddressList = walletNfts.map((nft) =>
        (nft as Metadata<JsonMetadata<string>>).mintAddress.toString()
      );

      setUserNfts(nftsAddressList);
      setUserNftsIsLoading(false);
    } catch (err) {
      Logger.error(err);
      setUserNftsIsLoading(false);
    }
  }, [metaplex, publicKey]);

  const getProductLockedMap = useCallback(async () => {
    const productsLockedMap: any = {};

    await asyncForEach(
      storeNfts?.findNftsByStoreId,
      async ({
        productsUnlocked,
        nftAddress,
      }: {
        productsUnlocked: string[];
        nftAddress: string;
      }) => {
        await asyncForEach(productsUnlocked, async (productId) => {
          const printedVersions = await getPrintedVersionsFromMasterAddress(
            nftAddress
          );
          if (!productsLockedMap[productId]) {
            productsLockedMap[productId] = [...printedVersions];
          } else {
            productsLockedMap[productId] = [
              ...productsLockedMap[productId],
              ...printedVersions,
            ];
          }
        });
      }
    );

    setProductsLockedWithNftAddress(productsLockedMap);
  }, [storeNfts?.findNftsByStoreId]);

  useEffect(() => {
    getProductLockedMap();
  }, [getProductLockedMap]);

  // // Generating a map of the product locked with the NFTs address that unlocks them.
  // const productsLockedWithNftAddress = useMemo(
  //   () => getProductsLockedWithNftAddress(storeNfts?.findNftsByStoreId),
  //   [storeNfts?.findNftsByStoreId]
  // );

  // console.log('productsLockedWithNftAddress', productsLockedWithNftAddress);

  useEffect(() => {
    getUserNfts();
  }, [getUserNfts]);

  const getCtx = useCallback(() => {
    return { userNftsIsLoading, userNfts, productsLockedWithNftAddress };
  }, [userNftsIsLoading, userNfts, productsLockedWithNftAddress]);

  return <NftContext.Provider value={getCtx()}>{children}</NftContext.Provider>;
};

export const useNft = () => {
  return useContext(NftContext);
};
