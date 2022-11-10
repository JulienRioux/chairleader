import { useWallet } from '@solana/wallet-adapter-react';
import { Button, Icon, Input, message, Select } from 'components-library';
import { useCart } from 'hooks/cart';
import { useSplTokenPayent } from 'hooks/spl-token-payment';
import { useWalletModal } from 'hooks/wallet-modal';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import styled from 'styled-components';
import { Logger } from 'utils';
import { useBalance } from 'hooks/balance';
import { useNft } from 'hooks/nft';
import { useStore } from 'hooks/store';
import { REST_OF_THE_WORLD_TEXT } from 'components/shipping-setup';
import countries from 'components/shipping-setup/countries.json';

const PayButton = styled(Button)`
  position: relative;
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 8px;
`;

const InsufficientFundsWrapper = styled.div`
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 1px solid;
  color: ${(p) => p.theme.color.danger};
  background-color: ${(p) => p.theme.color.danger}11;
  padding: 20px;
  font-size: 14px;
  line-height: 1.4;
`;

const InsufficientFundTitle = styled.div`
  margin-bottom: 8px;
  line-height: 1;
  font-weight: bold;
  font-size: 16px;
`;

const USE_DEV_SHIPPING_FORM = false;

const shippingFormFilled = {
  email: 'julien.rioux@toptal.com',
  name: 'John Doe',
  country: 'Canada',
  address: '11042 Sainte-Gertrude',
  city: 'Montreal',
  state: 'Quebec',
  postalCode: 'H1G5N9',
};

const shippingFormEmpty = {
  email: '',
  name: '',
  country: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
};

const {
  email: emailInitialState,
  name: nameInitialState,
  country: countryInitialState,
  address: addressInitialState,
  city: cityInitialState,
  state: stateInitialState,
  postalCode: postalCodeInitialState,
} = USE_DEV_SHIPPING_FORM ? shippingFormFilled : shippingFormEmpty;

const ALL_COUNTRIES_OPTIONS = countries.map(({ name }) => ({
  value: name,
  label: name,
}));

export const ShippingForm = () => {
  const {
    totalWithSaleTax,
    discount,
    totalPrice,
    setUserCountry,
    userCountry,
  } = useCart();

  const [email, setEmail] = useState(emailInitialState);
  const [name, setName] = useState(nameInitialState);
  const [country, setCountry] = useState(userCountry ?? countryInitialState);
  const [address, setAddress] = useState(addressInitialState);
  const [city, setCity] = useState(cityInitialState);
  const [state, setState] = useState(stateInitialState);
  const [postalCode, setPostalCode] = useState(postalCodeInitialState);

  const [paymentIsLoading, setPaymentIsLoading] = useState(false);

  const { userBalance, isLoading: userBalanceIsLoading } = useBalance();
  const { storeNftsAreLoading } = useNft();

  const { store } = useStore();

  const { openConnectModal } = useWalletModal();

  const { publicKey, connecting } = useWallet();

  const { makePayment } = useSplTokenPayent();

  const finalPayment = totalWithSaleTax - totalPrice * discount;

  const INSUFFICIENT_FUNDS = userBalance && userBalance < totalWithSaleTax;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.name === 'email') {
        setEmail(e.target.value);
        return;
      }
      if (e.target.name === 'name') {
        setName(e.target.value);
        return;
      }
      if (e.target.name === 'country') {
        setCountry(e.target.value);
        setUserCountry(e.target.value);
        return;
      }
      if (e.target.name === 'address') {
        setAddress(e.target.value);
        return;
      }
      if (e.target.name === 'city') {
        setCity(e.target.value);
        return;
      }
      if (e.target.name === 'state') {
        setState(e.target.value);
        return;
      }
      if (e.target.name === 'postalCode') {
        setPostalCode(e.target.value);
        return;
      }
    },
    [setUserCountry]
  );

  const handlePay = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const shippingInfo = {
        email,
        name,
        country,
        address,
        city,
        state,
        postalCode,
      };

      try {
        if (INSUFFICIENT_FUNDS) {
          message.error('Insufficient funds.');
          return;
        }

        setPaymentIsLoading(true);

        await makePayment({
          amount: Number(finalPayment),
          shippingInfo,
        });
      } catch (err) {
        Logger.error(err);
      }
      setPaymentIsLoading(false);
    },
    [
      INSUFFICIENT_FUNDS,
      address,
      city,
      country,
      email,
      finalPayment,
      makePayment,
      name,
      postalCode,
      state,
    ]
  );

  // Add all countries if the store has "Rest of the world selected"
  const hasRestOfTheWorldOption = store?.shippingRates?.find(
    ({ country }: { country: string }) => country === REST_OF_THE_WORLD_TEXT
  );

  const COUNTRY_OPTIONS = hasRestOfTheWorldOption
    ? ALL_COUNTRIES_OPTIONS
    : store?.shippingRates?.map(({ country }: { country: string }) => ({
        value: country,
        label: country,
      })) ?? [];

  return (
    <form onSubmit={handlePay}>
      <Input
        label="Email"
        required
        name="email"
        value={email}
        placeholder="Enter your email"
        onChange={handleChange}
      />

      <Input
        label="Name"
        required
        name="name"
        value={name}
        placeholder="Enter your name"
        onChange={handleChange}
      />

      <Select
        label="Country"
        value={country}
        onChange={handleChange}
        options={COUNTRY_OPTIONS}
        name="country"
        id="country"
        placeholder="Select a country"
        required
      />

      <Input
        label="Address"
        required
        name="address"
        value={address}
        placeholder="Enter your address"
        onChange={handleChange}
      />

      <Input
        label="City"
        required
        name="city"
        value={city}
        placeholder="Enter your city"
        onChange={handleChange}
      />

      <Input
        label="State/Province"
        name="state"
        value={state}
        placeholder="Enter your state or province"
        onChange={handleChange}
      />

      <Input
        label="Postal code/ZIP"
        required
        name="postalCode"
        placeholder="Enter your postal code or ZIP"
        onChange={handleChange}
        value={postalCode}
      />

      {INSUFFICIENT_FUNDS && (
        <InsufficientFundsWrapper>
          <InsufficientFundTitle>
            <Icon name="warning_amber" /> Insufficient funds.
          </InsufficientFundTitle>
          <div>
            You have {userBalance} USDC in your wallet. Please add funds in
            order to continue the transaction.
          </div>
        </InsufficientFundsWrapper>
      )}

      <div style={{ margin: '12px 0' }}>
        {publicKey ? (
          <PayButton
            fullWidth
            type="submit"
            isLoading={
              paymentIsLoading || userBalanceIsLoading || storeNftsAreLoading
            }
          >
            <span>Pay {finalPayment} USDC</span>
            <IconWrapper>
              <Icon name="lock" />
            </IconWrapper>
          </PayButton>
        ) : (
          <Button
            type="button"
            onClick={openConnectModal}
            fullWidth
            isLoading={connecting}
          >
            Connect wallet
          </Button>
        )}
      </div>
    </form>
  );
};
