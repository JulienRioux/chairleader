import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { connection } from '../../connection';
import { programId } from '../utils';

/** This is almost working but I can't get my head around how to encode the data... */
export const post = async (request, response) => {
  try {
    const recipientField = request.query.recipient;
    if (!recipientField) throw new Error('missing recipient');
    if (typeof recipientField !== 'string')
      throw new Error('invalid recipient');
    const recipient = new PublicKey(recipientField);

    const amountField = request.query.amount;
    if (!amountField) throw new Error('missing amount');
    if (typeof amountField !== 'string') throw new Error('invalid amount');
    const amount = new BigNumber(amountField);

    const splTokenField = request.query['spl-token'];
    if (splTokenField && typeof splTokenField !== 'string')
      throw new Error('invalid spl-token');
    const splToken = splTokenField ? new PublicKey(splTokenField) : undefined;

    const referenceField = request.query.reference;
    if (!referenceField) throw new Error('missing reference');
    if (typeof referenceField !== 'string')
      throw new Error('invalid reference');
    const reference = new PublicKey(referenceField);

    const memoParam = request.query.memo;
    if (memoParam && typeof memoParam !== 'string')
      throw new Error('invalid memo');
    const memo = memoParam || undefined;

    const messageParam = request.query.message;
    if (messageParam && typeof messageParam !== 'string')
      throw new Error('invalid message');
    const message = messageParam || undefined;

    const body = JSON.parse(request?.apiGateway?.event?.body);

    // Account provided in the transaction request body by the wallet.
    const accountField = body?.account;
    if (!accountField) throw new Error('missing account');
    if (typeof accountField !== 'string') throw new Error('invalid account');
    const account = new PublicKey(accountField);

    const transaction = new Transaction();

    const intermediaryAccount = new PublicKey(
      'CaLiBb3CPagr4Vfaiyr6dsBZ5vxadjN33o6QgaMzj48m'
    );

    transaction.feePayer = account;

    const keys = [
      // recipient
      {
        pubkey: recipient,
        isSigner: false,
        isWritable: true,
      },
      // Payer
      {
        pubkey: account,
        isSigner: true,
        isWritable: true,
      },
      // System program
      {
        pubkey: new PublicKey('11111111111111111111111111111111'),
        isSigner: false,
        isWritable: false,
      },
      // intermediaryAccount
      {
        pubkey: intermediaryAccount,
        isSigner: false,
        isWritable: true,
      },
      // Reference
      {
        pubkey: reference,
        isSigner: false,
        isWritable: false,
      },
    ];

    const instruction = new TransactionInstruction({
      programId,
      keys,
      // Cant get the right encoding here but using encoded data works...
      data: Buffer.from(
        new Uint8Array([
          99, 9, 23, 110, 101, 110, 213, 240, 138, 146, 1, 0, 0, 0, 0, 0, 186,
          44, 0, 0, 0, 0, 0, 0,
        ])
      ),
    });

    transaction.add(instruction);

    const blockhash = (await connection.getLatestBlockhash('finalized'))
      .blockhash;

    transaction.recentBlockhash = blockhash;

    const serializedTransaction = transaction.serialize({
      verifySignatures: false,
      requireAllSignatures: false,
    });

    const base64Transaction = serializedTransaction.toString('base64');

    response.status(200).send({ transaction: base64Transaction, message });
  } catch (err) {
    console.log(err);
    return null;
  }
};
