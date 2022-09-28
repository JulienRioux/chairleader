import { Wallet } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button, ChildWrapper, UnstyledExternalLink } from 'components-library';
import { useCallback, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import { formatShortAddress } from 'utils';
import { useWalletModal } from 'hooks/wallet-modal';

const ConnectWalletBtnWrapper = styled.span`
  margin-right: 12px;

  @media (max-width: 1000px) {
    margin-right: 0;
  }
`;

const LoginDisclaimer = styled.p`
  background: ${(p) => p.theme.color.text}11;
  padding: 8px;
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 1px solid ${(p) => p.theme.color.text}11;
  font-size: 14px;
  line-height: 1.4;
`;

const StyledButton = styled(Button)`
  margin-bottom: 8px;

  img {
    width: 20px;
    height: 20px;
  }

  ${ChildWrapper} {
    width: 100%;
  }
`;

const InnerBtnWapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ReadyState = styled.span`
  margin: 0 12px;
  font-size: 14px;
  font-weight: normal;
  color: ${(p) => p.theme.color.lightText};
`;

const ReadyStateAndImg = styled.span`
  display: flex;
  align-items: center;
`;

const SingleWalletBtn = ({
  name,
  handleWalletClick,
  isLoaded,
  icon,
  isLoading,
}: any) => (
  <StyledButton
    key={name}
    secondary
    fullWidth
    onClick={(e: any) => handleWalletClick(e, name)}
    isLoading={isLoading}
  >
    <InnerBtnWapper>
      <span>{name}</span>

      <ReadyStateAndImg>
        {isLoaded && <ReadyState>Detected</ReadyState>}
        <img src={icon} />
      </ReadyStateAndImg>
    </InnerBtnWapper>
  </StyledButton>
);

export const ConnectWalletModalContent = ({
  closeModal,
}: {
  closeModal: () => void;
}) => {
  const { wallets, select, connecting, publicKey, wallet } = useWallet();

  const [installedWallets, otherWallets] = useMemo(() => {
    const installed: Wallet[] = [];
    const notDetected: Wallet[] = [];
    const loadable: Wallet[] = [];

    for (const wallet of wallets) {
      if (wallet.readyState === WalletReadyState.NotDetected) {
        notDetected.push(wallet);
      } else if (wallet.readyState === WalletReadyState.Loadable) {
        loadable.push(wallet);
      } else if (wallet.readyState === WalletReadyState.Installed) {
        installed.push(wallet);
      }
    }

    return [installed, [...loadable, ...notDetected]];
  }, [wallets]);

  const handleWalletClick = useCallback(
    (e: MouseEvent, walletName: WalletName) => {
      e.preventDefault();
      select(walletName);
    },
    [select]
  );

  useEffect(() => {
    if (!connecting && publicKey) {
      closeModal();
    }
  }, [closeModal, connecting, publicKey]);

  return (
    <>
      {installedWallets.map(({ adapter: { name, icon } }) => (
        <SingleWalletBtn
          name={name}
          handleWalletClick={handleWalletClick}
          isLoaded
          icon={icon}
          key={name}
          isLoading={name === wallet?.adapter.name && connecting}
        />
      ))}

      {otherWallets.map(({ adapter: { name, icon, readyState, url } }) =>
        readyState === WalletReadyState.Loadable ? (
          <SingleWalletBtn
            name={name}
            handleWalletClick={handleWalletClick}
            icon={icon}
            key={name}
          />
        ) : (
          <UnstyledExternalLink href={url} target="_blank">
            <SingleWalletBtn name={name} icon={icon} key={name} />
          </UnstyledExternalLink>
        )
      )}

      <div>
        <LoginDisclaimer>
          By connecting a wallet, you agree to Chairleader'{' '}
          <a
            href="https://chairleader.xyz/static/terms-of-service"
            target="_blank"
            rel="noreferrer"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href="https://chairleader.xyz/static/privacy"
            target="_blank"
            rel="noreferrer"
          >
            Privacy policy
          </a>
          .
        </LoginDisclaimer>
      </div>
    </>
  );
};

export const ConnectedWalletModalContent = ({
  closeModal,
}: {
  closeModal: () => void;
}) => {
  const { disconnect, wallet, publicKey } = useWallet();

  const handleDisconnect = useCallback(() => {
    disconnect();
    closeModal();
  }, [closeModal, disconnect]);

  const walletAddress = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const cluster = 'devnet';

  return (
    <>
      <p style={{ margin: '4px 0 24px' }}>
        Connected with {wallet?.adapter.name}.
      </p>

      <UnstyledExternalLink
        href={`https://solscan.io/account/${walletAddress}?cluster=${cluster}`}
        target="_blank"
      >
        <Button
          secondary
          fullWidth
          icon="launch"
          style={{ marginBottom: '12px' }}
        >
          View on Explorer
        </Button>
      </UnstyledExternalLink>

      <Button secondary fullWidth onClick={handleDisconnect}>
        Disconnect
      </Button>
    </>
  );
};

export const ConnectWalletBtn = () => {
  const { publicKey, connecting } = useWallet();

  const { openConnectModal, openConnectedModal } = useWalletModal();

  const walletAddress = useMemo(() => publicKey?.toBase58(), [publicKey]);

  return (
    <ConnectWalletBtnWrapper>
      {!walletAddress && (
        <Button isLoading={connecting} secondary onClick={openConnectModal}>
          Connect wallet
        </Button>
      )}

      {walletAddress && (
        <Button secondary onClick={openConnectedModal}>
          {formatShortAddress(walletAddress)}
        </Button>
      )}
    </ConnectWalletBtnWrapper>
  );
};
