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
import { Logger } from 'utils';
import {
  JsonMetadata,
  Metadata,
  Nft,
  NftPrintEdition,
} from '@metaplex-foundation/js';

export interface INftContext {
  userNftsIsLoading: boolean;
  userNfts: string[];
}

export const NftContext = createContext<INftContext>({} as INftContext);

export const NftProvider: React.FC<IBaseProps> = ({ children }) => {
  const { metaplex } = useMetaplex();
  const { publicKey } = useWallet();
  const [userNfts, setUserNfts] = useState<string[]>([]);
  const [userNftsIsLoading, setUserNftsIsLoading] = useState(false);

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

      const nftsAddressList = walletNfts.map((nft) => nft.address.toString());

      setUserNfts(nftsAddressList);
      setUserNftsIsLoading(false);
    } catch (err) {
      Logger.error(err);
      setUserNftsIsLoading(false);
    }
  }, [metaplex, publicKey]);

  useEffect(() => {
    getUserNfts();
  }, [getUserNfts]);

  const getCtx = useCallback(() => {
    return { userNftsIsLoading, userNfts };
  }, [userNftsIsLoading, userNfts]);

  return <NftContext.Provider value={getCtx()}>{children}</NftContext.Provider>;
};

export default NftContext.Consumer;

export const useNft = () => {
  return useContext(NftContext);
};
