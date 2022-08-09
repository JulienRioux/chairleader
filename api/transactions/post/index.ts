import { TextEncoder } from 'util';
import {
  ConfirmOptions,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { connection } from '../connection';
import { Program, web3, BN, AnchorProvider } from '@project-serum/anchor';
import * as idl from './idl/split_payment_sol.json';
import { Idl } from '@project-serum/anchor/dist/cjs/idl';
const { SystemProgram } = web3;
import { opts, programId, SERVICE_FEES } from './utils';
import * as dotenv from 'dotenv';
import { NodeWallet } from './node-wallet';

dotenv.config();

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
