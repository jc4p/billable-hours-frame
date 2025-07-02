import { NextResponse } from 'next/server';
import { createPublicClient, http, parseAbi } from 'viem';
import { base } from 'viem/chains';
import { saveTransaction } from '@/lib/db';

export const runtime = 'edge';

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL),
});

const usdcContractAddress = process.env.USDC_CONTRACT_ADDRESS;
const recipientAddress = process.env.RECIPIENT_ADDRESS;

const erc20Abi = parseAbi([
  'function transfer(address to, uint256 amount)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
]);

export async function POST(req) {
  const { transactionId, fid, amount, label } = await req.json();

  if (!transactionId || !fid || !amount || !label) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const tx = await publicClient.getTransactionReceipt({ hash: transactionId });

    if (tx.status !== 'success') {
      return NextResponse.json({ error: 'Transaction failed' }, { status: 400 });
    }

    const transferLog = tx.logs.find(log => {
      return (
        log.address.toLowerCase() === usdcContractAddress.toLowerCase() &&
        log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' && // Transfer event signature
        log.topics[2].toLowerCase() === `0x${recipientAddress.slice(2).padStart(64, '0')}`.toLowerCase()
      );
    });

    if (!transferLog) {
      return NextResponse.json({ error: 'Transfer event not found' }, { status: 400 });
    }

    const transferredAmount = BigInt(transferLog.data);
    const expectedAmount = BigInt(amount) * BigInt(10 ** 6); // USDC has 6 decimals

    if (transferredAmount < expectedAmount) {
      return NextResponse.json({ error: 'Incorrect transfer amount' }, { status: 400 });
    }

    const senderAddress = `0x${transferLog.topics[1].slice(26)}`;

    const savedTx = await saveTransaction(fid, transactionId, senderAddress, amount, label);

    return NextResponse.json({ success: true, transaction: savedTx.rows[0] });
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
