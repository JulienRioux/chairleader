import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  ConfirmOptions,
  Keypair,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { connection } from '../../connection';
import { TextEncoder } from 'util';
import { Program, web3, BN, AnchorProvider } from '@project-serum/anchor';
import * as idl from '../idl/split_payment_sol.json';
import { Idl } from '@project-serum/anchor/dist/cjs/idl';
const { SystemProgram } = web3;
import { opts, programId, SERVICE_FEES } from '../utils';
import { NodeWallet } from '../node-wallet';

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

// Using a wallet secret key
export const post2 = async (request, response) => {
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

    const intermediaryAccount = new PublicKey(
      'CaLiBb3CPagr4Vfaiyr6dsBZ5vxadjN33o6QgaMzj48m'
    );

    const PRIVATE_KEY = new TextEncoder().encode(process.env.SECRET_KEY);
    const PUBLIC_KEY = new PublicKey(process.env.PUBLIC_KEY ?? '');

    const wallet = new NodeWallet({
      secretKey: PRIVATE_KEY,
      publicKey: PUBLIC_KEY,
    } as Keypair);

    const provider = new AnchorProvider(
      connection,
      wallet,
      opts.preflightCommitment as ConfirmOptions
    );

    const program = new Program(idl as Idl, programId, provider);

    // Setting up the differents recipient amount
    const totalAmountInLamport = Number(amount) * LAMPORTS_PER_SOL;
    const recipientPayout = new BN(totalAmountInLamport * (1 - SERVICE_FEES));
    const servicePayout = new BN(totalAmountInLamport * SERVICE_FEES);

    const transaction = new Transaction();

    // Creating the transaction instructions
    const instructions = program.instruction.splitPaymentSol(
      recipientPayout,
      servicePayout,
      {
        accounts: {
          payer: account,
          recipient,
          systemProgram: new PublicKey(SystemProgram.programId),
          intermediaryAccount,
        },
      }
    );

    // Adding the reference to the instructions
    instructions.keys.push({
      pubkey: reference,
      isSigner: false,
      isWritable: false,
    });

    // Adding the instruction to the current transaction
    transaction.add(instructions);

    // Getting the latest block hash
    const blockhash = (await connection.getLatestBlockhash('finalized'))
      .blockhash;
    transaction.recentBlockhash = blockhash;

    // Setting up the feePayer
    transaction.feePayer = account;

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
