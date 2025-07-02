import { sql } from '@vercel/postgres';

export async function saveTransaction(fid, transactionHash, senderAddress, amount, label) {
  return await sql`
    INSERT INTO transactions (fid, transaction_hash, sender_address, amount, label)
    VALUES (${fid}, ${transactionHash}, ${senderAddress}, ${amount}, ${label})
    RETURNING *;
  `;
}