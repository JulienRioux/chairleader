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
  shippingFee: number;
  theme: {
    primaryColor: string;
  };
  homepage: {
    heroTitle: string;
    heroSubTitle: string;
    heroImage: string;
  };
  social: {
    instagramLink: string;
    twitterLink: string;
    facebookLink: string;
    tiktokLink: string;
    youtubeLink: string;
    spotifyLink: string;
    appleMusicLink: string;
    discordLink: string;
  };
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
  shippingFee: { type: Number, default: 0 },
  theme: {
    primaryColor: { type: String, default: 'blue' },
  },
  social: {
    instagramLink: String,
    twitterLink: String,
    facebookLink: String,
    tiktokLink: String,
    youtubeLink: String,
    spotifyLink: String,
    appleMusicLink: String,
    discordLink: String,
  },
  homepage: {
    heroTitle: String,
    heroSubTitle: String,
    heroImage: String,
  },
});

export const UserModel = model<IUser>('User', UserSchema);
