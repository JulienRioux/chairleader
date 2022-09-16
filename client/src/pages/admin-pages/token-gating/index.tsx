import { Button } from 'components-library';
import { useCallback } from 'react';

// const getNftsByOwner = async () => {
//   try {
//     console.log('Loading...');

//     const myNfts = await metaplex
//       .nfts()
//       .findAllByOwner({
//         owner: new PublicKey('BJ2L3GBiCiKd7nCdH3zYBzSbvvkiJZ3QjfASrxKhux2Q'),
//       })
//       .run();

//     return myNfts;
//   } catch (err) {
//     console.error(err);
//   }
// };

export const TokenGating = () => {
  const uploadNftMetadata = useCallback(async () => {
    //
  }, []);

  return (
    <div>
      <h1>Token gating</h1>
      <Button onClick={uploadNftMetadata}>Upload metadata</Button>
    </div>
  );
};
