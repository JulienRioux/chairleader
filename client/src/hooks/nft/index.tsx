import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as React from 'react';
import { IBaseProps } from 'types';
import { useMetaplex } from 'hooks/metaplex';
import { useWallet } from '@solana/wallet-adapter-react';
import { getPrintedVersionsFromMasterAddress, Logger } from 'utils';
import { JsonMetadata, Metadata } from '@metaplex-foundation/js';
import { FIND_NFT_BY_STORE_ID } from 'queries';
import { useQuery } from '@apollo/client';

export interface INftContext {
  userNftsIsLoading: boolean;
  userNfts: string[];
  productsLockedWithNftAddress: any;
  checkIfTokenGatedProduct: any;
  storeNfts: any;
  storeNftsAreLoading: boolean;
  nftAddressWithProductsLocked: any;
  mapProductLockedToMaster: any;
  refreshUserNfts: () => void;
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

  const [nftAddressWithProductsLocked, setNftAddressWithProductsLocked] =
    useState<any>({});

  const [mapProductLockedToMaster, setMapProductLockedToMaster] = useState<any>(
    {}
  );

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
    const nftLockMap: any = {};
    const productLockedMapToMaster: any = {};

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
          //   Creating the nft products unlocked mapping
          nftLockMap[nftAddress] = productsUnlocked;

          // Creating the products unlocked mapping to master NFT
          if (!productLockedMapToMaster[productId]) {
            productLockedMapToMaster[productId] = [nftAddress];
          } else {
            productLockedMapToMaster[productId].push(nftAddress);
          }
        });
      }
    );

    setProductsLockedWithNftAddress(productsLockedMap);
    setNftAddressWithProductsLocked(nftLockMap);
    setMapProductLockedToMaster(productLockedMapToMaster);
  }, [storeNfts?.findNftsByStoreId]);

  useEffect(() => {
    getProductLockedMap();
  }, [getProductLockedMap]);

  /** Check if the product it token gated, if so, return the array of nft addresses that unlock the product */
  const checkIfTokenGatedProduct = useCallback(
    (productId: string) => {
      return productsLockedWithNftAddress[productId];
    },
    [productsLockedWithNftAddress]
  );

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
    return {
      userNftsIsLoading,
      userNfts,
      productsLockedWithNftAddress,
      checkIfTokenGatedProduct,
      storeNfts,
      storeNftsAreLoading,
      nftAddressWithProductsLocked,
      mapProductLockedToMaster,
      refreshUserNfts: getUserNfts,
    };
  }, [
    userNftsIsLoading,
    userNfts,
    productsLockedWithNftAddress,
    checkIfTokenGatedProduct,
    storeNfts,
    storeNftsAreLoading,
    nftAddressWithProductsLocked,
    mapProductLockedToMaster,
    getUserNfts,
  ]);

  return <NftContext.Provider value={getCtx()}>{children}</NftContext.Provider>;
};

export const useNft = () => {
  return useContext(NftContext);
};
