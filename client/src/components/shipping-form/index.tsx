import { useWallet } from '@solana/wallet-adapter-react';
import { Button, Icon, Input, message } from 'components-library';
import { useCart } from 'hooks/cart';
import { useSplTokenPayent } from 'hooks/spl-token-payment';
import { useWalletModal } from 'hooks/wallet-modal';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import styled from 'styled-components';
import { Logger } from 'utils';

const PayButton = styled(Button)`
  position: relative;
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 8px;
`;

const USE_DEV_SHIPPING_FORM = true;

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

export const ShippingForm = () => {
  const [email, setEmail] = useState(emailInitialState);
  const [name, setName] = useState(nameInitialState);
  const [country, setCountry] = useState(countryInitialState);
  const [address, setAddress] = useState(addressInitialState);
  const [city, setCity] = useState(cityInitialState);
  const [state, setState] = useState(stateInitialState);
  const [postalCode, setPostalCode] = useState(postalCodeInitialState);

  const [paymentIsLoading, setPaymentIsLoading] = useState(false);

  const { openConnectModal } = useWalletModal();

  const { publicKey } = useWallet();

  const { makePayment } = useSplTokenPayent();

  const { totalWithSaleTax } = useCart();

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
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
  }, []);

  const handlePay = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      console.log('Shipping information =>>>', {
        email,
        name,
        country,
        address,
        city,
        state,
        postalCode,
      });

      try {
        setPaymentIsLoading(true);
        console.log('Payment started');
        await makePayment({ amount: Number(totalWithSaleTax) });
        message.success('Payment succeed');
      } catch (err) {
        Logger.error(err);
      }
      setPaymentIsLoading(false);
    },
    [
      address,
      city,
      country,
      email,
      makePayment,
      name,
      postalCode,
      state,
      totalWithSaleTax,
    ]
  );

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

      <Input
        label="Country"
        required
        name="country"
        value={country}
        placeholder="Enter your country"
        onChange={handleChange}
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

      <div style={{ margin: '12px 0' }}>
        {publicKey ? (
          <PayButton fullWidth type="submit" isLoading={paymentIsLoading}>
            <span>Pay {totalWithSaleTax} USDC</span>
            <IconWrapper>
              <Icon name="lock" />
            </IconWrapper>
          </PayButton>
        ) : (
          <Button type="button" onClick={openConnectModal} fullWidth>
            Connect wallet
          </Button>
        )}
      </div>
    </form>
  );
};
