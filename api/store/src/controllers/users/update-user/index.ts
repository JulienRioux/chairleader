import { UserModel } from '../../../models/user';

export const updateUser = async ({
  id,
  storeName,
  walletAddress,
  subDomain,
  currency,
  saleTax,
  image,
}) => {
  const user = await UserModel.findByIdAndUpdate(
    id,
    {
      ...(storeName && { storeName }),
      ...(walletAddress && { walletAddress }),
      ...(subDomain && { subDomain }),
      ...(currency && { currency }),
      ...(!isNaN(saleTax) && { saleTax }),
      ...(image && { image }),
      updatedAt: new Date(),
    },
    { upsert: true }
  );
  return user;
};
