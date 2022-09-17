import { createContext, useCallback, useContext } from 'react';
import * as React from 'react';
import { IBaseProps } from 'types';
import { useModal } from 'components-library';
import {
  ConnectedWalletModalContent,
  ConnectWalletModalContent,
} from 'components/connect-wallet-btn';

export interface IWalletModalContext {
  openConnectModal: () => void;
  openConnectedModal: () => void;
}

export const WalletModalContext = createContext<IWalletModalContext>(
  {} as IWalletModalContext
);

export const WalletModalProvider: React.FC<IBaseProps> = ({ children }) => {
  const {
    openModal: openConnectModal,
    Modal: ConnectModal,
    closeModal: closeConnectModal,
  } = useModal();

  const {
    openModal: openConnectedModal,
    Modal: ConnectedModal,
    closeModal: closeConnectedModal,
  } = useModal();

  const getCtx = useCallback(() => {
    return {
      openConnectModal,
      openConnectedModal,
    };
  }, [openConnectModal, openConnectedModal]);

  return (
    <WalletModalContext.Provider value={getCtx()}>
      {children}

      <ConnectModal title="Connect a wallet">
        <ConnectWalletModalContent closeModal={closeConnectModal} />
      </ConnectModal>

      <ConnectedModal title="Account">
        <ConnectedWalletModalContent closeModal={closeConnectedModal} />
      </ConnectedModal>
    </WalletModalContext.Provider>
  );
};

export default WalletModalContext.Consumer;

export const useWalletModal = () => {
  return useContext(WalletModalContext);
};
