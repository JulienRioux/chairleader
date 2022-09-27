import { Button, Icon, Input } from 'components-library';
import { useCart } from 'hooks/cart';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import styled from 'styled-components';

const PayButton = styled(Button)`
  position: relative;
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 8px;
`;

export const ShippingForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

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
    (e: FormEvent) => {
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
      console.log('Payment processing...');
    },
    [address, city, country, email, name, postalCode, state]
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
        <PayButton fullWidth type="submit">
          <span>Pay {totalWithSaleTax} USDC</span>
          <IconWrapper>
            <Icon name="lock" />
          </IconWrapper>
        </PayButton>
      </div>
    </form>
  );
};
