import { model, Schema } from 'mongoose';

import { BASE_SHCHEMA } from '../base';

export interface IUser {
  email: string;
  name: string;
  auth: {
    code: string;
    expiration: Date;
  };
  storeName: string;
  walletAddress: string;
  subDomain: string;
  currency: string;
  saleTax: number;
  image: string;
}

const UserSchema = new Schema<IUser>({
  ...BASE_SHCHEMA,
  auth: {
    code: { required: true, type: String },
    expiration: { required: true, type: Date },
  },
  email: { required: true, type: String, unique: true },
  storeName: String,
  walletAddress: String,
  subDomain: { required: true, type: String, unique: true },
  currency: String,
  saleTax: Number,
  image: String,
});

export const UserModel = model<IUser>('User', UserSchema);
