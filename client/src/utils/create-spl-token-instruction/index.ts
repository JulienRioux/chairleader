import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
import BigNumber from 'bignumber.js';

import {
  getAssociatedTokenAddress,
  getMint,
  getAccount,
  createTransferCheckedInstruction,
} from '@solana/spl-token';

export class CreateTransferError extends Error {
  name = 'CreateTransferError';
}

export async function createSPLTokenInstruction({
  recipient,
  amount,
  splToken,
  sender,
  connection,
}: {
  recipient: PublicKey;
  amount: BigNumber;
  splToken: PublicKey;
  sender: PublicKey;
  connection: Connection;
}): Promise<TransactionInstruction> {
  // Check that the token provided is an initialized mint
  const mint = await getMint(connection, splToken);
  if (!mint.isInitialized)
    throw new CreateTransferError('mint not initialized');

  // Convert input decimal amount to integer tokens according to the mint decimals
  amount = amount
    .times(new BigNumber(10).pow(mint.decimals))
    .integerValue(BigNumber.ROUND_FLOOR);

  // Check that the amount provided doesn't have greater precision than the mint
  if (amount.decimalPlaces() > mint.decimals)
    throw new CreateTransferError('amount decimals invalid');

  // Get the sender's ATA and check that the account exists and can send tokens
  const senderATA = await getAssociatedTokenAddress(splToken, sender);
  const senderAccount = await getAccount(connection, senderATA);
  if (!senderAccount.isInitialized)
    throw new CreateTransferError('sender not initialized');
  if (senderAccount.isFrozen) throw new CreateTransferError('sender frozen');

  // Get the recipient's ATA and check that the account exists and can receive tokens
  const recipientATA = await getAssociatedTokenAddress(splToken, recipient);
  const recipientAccount = await getAccount(connection, recipientATA);
  if (!recipientAccount.isInitialized)
    throw new CreateTransferError('recipient not initialized');
  if (recipientAccount.isFrozen)
    throw new CreateTransferError('recipient frozen');

  // Check that the sender has enough tokens
  const tokens = BigInt(String(amount));
  if (tokens > senderAccount.amount)
    throw new CreateTransferError('insufficient funds');

  // Create an instruction to transfer SPL tokens, asserting the mint and decimals match
  return createTransferCheckedInstruction(
    senderATA,
    splToken,
    recipientATA,
    sender,
    tokens,
    mint.decimals
  );
}
