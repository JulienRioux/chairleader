import { LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { connection } from '../connection';
import { web3, BN } from '@project-serum/anchor';
const { SystemProgram } = web3;
import { DEVNET_DUMMY_MINT, SERVICE_FEES } from './utils';
import { getMint } from '@solana/spl-token';
import { createSPLTokenInstruction } from './create-spl-token-instruction';

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

    // Creating a new transaction
    const transaction = new Transaction();

    const IS_SOL_PAYMENT = !splToken;

    if (IS_SOL_PAYMENT) {
      // Setting up the differents recipient amount
      const totalAmountInLamport = Number(amount) * LAMPORTS_PER_SOL;
      const recipientPayout = new BN(totalAmountInLamport * (1 - SERVICE_FEES));
      const servicePayout = new BN(totalAmountInLamport * SERVICE_FEES);

      // Payment instructions
      const paymentInstructions = SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: recipient,
        lamports: recipientPayout,
      });

      // Adding the reference to the payment instructions
      paymentInstructions.keys.push({
        pubkey: reference,
        isSigner: false,
        isWritable: false,
      });

      // Adding the payment instruction to the current transaction
      transaction.add(paymentInstructions);

      // Fees instructions
      const feesInstructions = SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: intermediaryAccount,
        lamports: servicePayout,
      });

      // Adding the instruction to the current transaction
      transaction.add(feesInstructions);
    } else {
      const mint = await getMint(connection, splToken);

      // Setting up the differents recipient amount
      const totalAmount = Number(amount);

      const servicePayout = Number(
        (totalAmount * SERVICE_FEES)?.toFixed(mint.decimals)
      );

      const recipientPayout = totalAmount - servicePayout;

      const paymentInstructions = await createSPLTokenInstruction({
        recipient,
        amount: new BigNumber(recipientPayout),
        splToken: DEVNET_DUMMY_MINT,
        sender: account,
        connection,
      });

      // Adding the reference to the payment instructions
      paymentInstructions.keys.push({
        pubkey: reference,
        isSigner: false,
        isWritable: false,
      });

      // Adding the payment instruction to the current transaction
      transaction.add(paymentInstructions);

      // Fees instructions
      const feesInstructions = await createSPLTokenInstruction({
        recipient: intermediaryAccount,
        amount: new BigNumber(servicePayout),
        splToken: DEVNET_DUMMY_MINT,
        sender: account,
        connection,
      });

      // Adding the instruction to the current transaction
      transaction.add(feesInstructions);
    }

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
