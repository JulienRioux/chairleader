import {
  Button,
  Input,
  message,
  Select,
  Table,
  useModal,
} from 'components-library';
import { useAuth } from 'hooks/auth';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import countries from 'components/shipping-setup/countries.json';
import { LocalPickup } from './local-pickup';

export const TitleAndButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
  padding-bottom: 8px;

  h3 {
    margin: 0;
  }
`;

const RestOfTheWorldExplaination = styled.p`
  line-height: 1.4;
  font-size: 14px;
  color: ${(p) => p.theme.color.lightText};
`;

export const REST_OF_THE_WORLD_TEXT = '* Rest of the world';

const REST_OF_THE_WORLD = {
  value: REST_OF_THE_WORLD_TEXT,
  label: REST_OF_THE_WORLD_TEXT,
};

const COUNTRIES_OPTIONS = [
  REST_OF_THE_WORLD,
  ...countries.map(({ name }) => ({
    value: name,
    label: name,
  })),
];

const ShippingRates = () => {
  const { user, updateUser, updateUserIsLoading } = useAuth();

  const { openModal, Modal, closeModal, isOpen } = useModal();

  const [shippingRates, setShippingRates] = useState<IShippingRate[]>(
    user?.shippingRates ?? []
  );

  const [shippingRate, setShippingRate] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const updateShippingRates = useCallback(
    async (newRates: any) => {
      await updateUser({ shippingRates: newRates });
      message.success('Shipping rates have been saved.');
    },
    [updateUser]
  );

  useEffect(() => {
    if (!isOpen) {
      // Reset the modal once it's closed
      setShippingRate('');
      setSelectedCountry('');
      setIsEditing(false);
    }
  }, [isOpen]);

  const handleAddShippingRate = useCallback(
    (e: any) => {
      e.preventDefault();
      // Check if the shipping country already exists, if so, remove the old value
      const filteredShippingRates = shippingRates.filter(
        ({ country }) => country !== selectedCountry
      );

      // Adding the shipping rates
      setShippingRates([
        { country: selectedCountry, rate: shippingRate },
        ...filteredShippingRates,
      ]);
      updateShippingRates([
        { country: selectedCountry, rate: shippingRate },
        ...filteredShippingRates,
      ]);
      closeModal();
    },
    [
      closeModal,
      selectedCountry,
      shippingRate,
      shippingRates,
      updateShippingRates,
    ]
  );

  const handleDelete = useCallback(
    (country: string) => {
      const filteredShippingRates = shippingRates.filter(
        ({ country: currentCountry }) => country !== currentCountry
      );
      setShippingRates(filteredShippingRates);
      updateShippingRates(filteredShippingRates);
      closeModal();
    },
    [closeModal, shippingRates, updateShippingRates]
  );

  const handleChange = useCallback((e: any) => {
    if (e.target.name === 'shippingRate') {
      setShippingRate(e.target.value);
    }
    if (e.target.name === 'country') {
      setSelectedCountry(e.target.value);
    }
  }, []);

  const handleRowClick = useCallback(
    (row: any) => {
      setIsEditing(true);
      setSelectedCountry(row['Country']);
      setShippingRate(row['Shipping rate']);
      openModal();
    },
    [openModal]
  );

  const hasRestOfTheWorld = shippingRates.find(
    ({ country }) => country === REST_OF_THE_WORLD_TEXT
  );

  const restOfTheWorldIsSelected = selectedCountry === REST_OF_THE_WORLD_TEXT;

  return (
    <>
      <TitleAndButton>
        <h3>Shipping rates</h3>

        <Button
          icon="add"
          onClick={openModal}
          secondary
          isLoading={updateUserIsLoading}
        />
      </TitleAndButton>

      {shippingRates?.length ? (
        <Table
          columns={['Country', 'Shipping rate']}
          rows={formatTableData(shippingRates)}
          handleRowClick={handleRowClick}
        />
      ) : (
        <p>No shipping rates yet.</p>
      )}

      {!!hasRestOfTheWorld && (
        <RestOfTheWorldExplaination>
          * Rest of the world: This rate apply for all other countries that are
          not selected.
        </RestOfTheWorldExplaination>
      )}

      <Modal title="Shipping rates">
        <form onSubmit={handleAddShippingRate}>
          <Select
            label="Country"
            value={selectedCountry}
            onChange={handleChange}
            options={COUNTRIES_OPTIONS}
            name="country"
            id="country"
            placeholder="Select a country"
            required
            disabled={isEditing}
          />

          {!!restOfTheWorldIsSelected && (
            <RestOfTheWorldExplaination>
              * Rest of the world: This rate apply for all other countries that
              are not selected.
            </RestOfTheWorldExplaination>
          )}

          <Input
            value={shippingRate}
            onChange={handleChange}
            name="shippingRate"
            label="Shipping rate (USDC)"
            type="number"
            placeholder="Enter a shipping rate"
            required
          />
          <Button fullWidth type="submit">
            Save
          </Button>

          <Button
            style={{ marginTop: '8px' }}
            fullWidth
            type="button"
            secondary
            onClick={() => handleDelete(selectedCountry)}
          >
            Delete
          </Button>
        </form>
      </Modal>
    </>
  );
};

interface IShippingRate {
  country: string;
  rate: string;
}

const alphabSortCountry = (shippingRates: IShippingRate[]) =>
  [...shippingRates]?.sort((a, b) => a?.country?.localeCompare(b?.country));

const formatTableData = (shippingRates: IShippingRate[]) => {
  const alphaSort = alphabSortCountry(shippingRates);
  const formattedData = alphaSort?.map(({ country, rate }) => ({
    'Shipping rate': rate,
    Country: country,
  }));
  return formattedData;
};

const SHOW_LOCAL_PICKUP = false;

export const ShippingSetup = () => {
  return (
    <>
      <div>
        <div style={{ marginBottom: '40px' }}>
          <ShippingRates />
        </div>

        {SHOW_LOCAL_PICKUP && <LocalPickup />}
      </div>
    </>
  );
};
