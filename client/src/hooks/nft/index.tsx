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
import { FIND_NFT_BY_STORE_ID, UPDATE_NFT } from 'queries';
import { useMutation, useQuery } from '@apollo/client';
import { useAuth } from 'hooks/auth';
import { useStore } from 'hooks/store';

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
  refetchStoreNfts: () => void;
  refreshProductLockedMap: () => void;
  checkIfUserCanPurchaseTokenGatedProduct: (productId: string) => any;
  checkIfUserHasPrintedVersion: any;
  updateNft: (args: any) => void;
  updateNftIsLoading: boolean;
  getProductLockedMapIsLoading: boolean;
  nftDiscount: number;
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
  const { user } = useAuth();
  const { store } = useStore();

  const [nftAddressWithProductsLocked, setNftAddressWithProductsLocked] =
    useState<any>({});

  const [mapProductLockedToMaster, setMapProductLockedToMaster] = useState<any>(
    {}
  );

  const [mapMasterToPrintedEditions, setMapMasterToPrintedEditions] =
    useState<any>({});

  const [getProductLockedMapIsLoading, setGetProductLockedMapIsLoading] =
    useState(true);

  const {
    loading: storeNftsAreLoading,
    data: storeNfts,
    refetch: refetchStoreNfts,
  } = useQuery(FIND_NFT_BY_STORE_ID, {
    skip: !user && !store,
    notifyOnNetworkStatusChange: true,
  });

  const [updateNftMutation, { loading: updateNftIsLoading }] =
    useMutation(UPDATE_NFT);

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

  const updateNft = useCallback(
    async ({
      nftId,
      productsUnlocked,
      isArchived,
    }: {
      nftId: string;
      productsUnlocked?: string[];
      isArchived?: boolean;
    }) => {
      await updateNftMutation({
        variables: {
          productsUnlocked,
          isArchived,
          id: nftId,
        },
      });
    },
    [updateNftMutation]
  );

  const getProductLockedMap = useCallback(async () => {
    const productsLockedMap: any = {};
    const nftLockMap: any = {};
    const productLockedMapToMaster: any = {};
    const masterToPrintedEditionsMap: any = {};

    const unarchivedNfts = storeNfts?.findNftsByStoreId?.filter(
      ({ isArchived }: { isArchived: boolean }) => !isArchived
    );

    // Do not run this if there is no data to fetch
    if (!unarchivedNfts?.length) {
      return;
    }

    setGetProductLockedMapIsLoading(true);

    await asyncForEach(
      unarchivedNfts,
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

          // Creating the master mapping to the printed versions
          masterToPrintedEditionsMap[nftAddress] = printedVersions;

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
    setMapMasterToPrintedEditions(masterToPrintedEditionsMap);

    setGetProductLockedMapIsLoading(false);
  }, [storeNfts]);

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

  const checkIfUserCanPurchaseTokenGatedProduct = useCallback(
    (productId: string) => {
      const tokenGated: string[] = productId
        ? productsLockedWithNftAddress[productId]
        : null;

      // If we did not fetch all the NFT copies, show the products that are token gated
      if (getProductLockedMapIsLoading) {
        const lockedProductsMap = new Set<string>();
        storeNfts?.findNftsByStoreId?.forEach(
          ({ productsUnlocked }: { productsUnlocked: string[] }) => {
            productsUnlocked.forEach((item) => lockedProductsMap.add(item));
          }
        );
        const isTokenGatedProductWhileLoading =
          lockedProductsMap.has(productId);

        return {
          isUnlocked: false,
          isTokenGated: isTokenGatedProductWhileLoading,
        };
      }

      const isTokenGatedProduct = tokenGated !== undefined;

      const printedNftUnlockingTheProduct =
        publicKey &&
        tokenGated?.find((nftAddress) => userNfts.includes(nftAddress));

      // Get the master edition
      let masterEdition = null;
      if (printedNftUnlockingTheProduct) {
        masterEdition = Object.keys(mapMasterToPrintedEditions).find(
          (masterEd) => {
            return mapMasterToPrintedEditions[masterEd].includes(
              printedNftUnlockingTheProduct
            );
          }
        );
      }

      return {
        isUnlocked: !!printedNftUnlockingTheProduct,
        isTokenGated: isTokenGatedProduct,
        nftPrintedEdition: printedNftUnlockingTheProduct,
        nftMasterEdition: masterEdition,
      };
    },
    [
      getProductLockedMapIsLoading,
      mapMasterToPrintedEditions,
      productsLockedWithNftAddress,
      publicKey,
      storeNfts?.findNftsByStoreId,
      userNfts,
    ]
  );

  const checkIfUserHasPrintedVersion = useCallback(
    (masterAddress: string) => {
      const currentNftPrintedVestion =
        mapMasterToPrintedEditions[masterAddress];
      const hasPrintedVersion = currentNftPrintedVestion?.some(
        (nftAddress: string) => userNfts.includes(nftAddress)
      );
      return hasPrintedVersion;
    },
    [mapMasterToPrintedEditions, userNfts]
  );

  const [nftDiscount, setNftDiscount] = useState(0);

  const getNftDiscount = useCallback(() => {
    // Filter out NFTs that did not have discount associated with
    const discountNfts = storeNfts?.findNftsByStoreId;
    // TODO: Order by  discount  (Bigger ot lower)

    // Check if the user has NFT with discount
    discountNfts?.forEach((discountNft: any) => {
      if (nftDiscount) return;
      const discountNftToUse = mapMasterToPrintedEditions[
        discountNft?.nftAddress
      ]?.find((printedVersion: string) => userNfts.includes(printedVersion));
      if (discountNftToUse) {
        // Setup the discount here
        setNftDiscount(0.1);
      }
    });
  }, [
    mapMasterToPrintedEditions,
    nftDiscount,
    storeNfts?.findNftsByStoreId,
    userNfts,
  ]);

  useEffect(() => {
    getNftDiscount();
  }, [getNftDiscount]);

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
      refetchStoreNfts,
      refreshProductLockedMap: getProductLockedMap,
      checkIfUserCanPurchaseTokenGatedProduct,
      checkIfUserHasPrintedVersion,
      updateNft,
      updateNftIsLoading,
      getProductLockedMapIsLoading,
      nftDiscount,
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
    refetchStoreNfts,
    getProductLockedMap,
    checkIfUserCanPurchaseTokenGatedProduct,
    checkIfUserHasPrintedVersion,
    updateNft,
    updateNftIsLoading,
    getProductLockedMapIsLoading,
    nftDiscount,
  ]);

  return <NftContext.Provider value={getCtx()}>{children}</NftContext.Provider>;
};

export const useNft = () => {
  return useContext(NftContext);
};
