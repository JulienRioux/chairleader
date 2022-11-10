import {
  Button,
  Input,
  message,
  Select,
  Table,
  useModal,
} from 'components-library';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { TitleAndButton } from '..';

export const LocalPickup = () => {
  const { openModal, Modal, closeModal } = useModal();

  const [localPickupFee, setLocalPickupFee] = useState<string>('');

  const [fee, setFee] = useState(localPickupFee);

  const handleChange = useCallback((e: any) => {
    setFee(e.target.value);
  }, []);

  const handleEditLocalPickup = useCallback(
    (e: any) => {
      // TODO: Save into the DB
      e.preventDefault();
      setLocalPickupFee(fee);
      closeModal();
      message.success('Local pickup have been updated.');
    },
    [closeModal, fee]
  );

  const handleDeleteLocalPickup = useCallback(() => {
    // TODO: Save into the DB
    setLocalPickupFee('');
    closeModal();
    message.success('Local pickup have been deleted.');
    setFee('');
  }, [closeModal]);

  return (
    <>
      <div>
        <TitleAndButton>
          <h3>Local pickup</h3>

          <Button
            icon={localPickupFee ? 'edit' : 'add'}
            onClick={openModal}
            secondary
          />
        </TitleAndButton>

        {localPickupFee ? (
          <p>
            ✅ Available for{' '}
            {localPickupFee === '0' ? 'Free' : `$${localPickupFee}`}
          </p>
        ) : (
          <p>No local pickup yet.</p>
        )}
      </div>

      <Modal title="Local pickup">
        <form onSubmit={handleEditLocalPickup}>
          <Input
            value={fee}
            onChange={handleChange}
            name="fee"
            label="Fee"
            type="number"
            placeholder="Enter a fee"
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
            onClick={handleDeleteLocalPickup}
          >
            Delete
          </Button>
        </form>
      </Modal>
    </>
  );
};
