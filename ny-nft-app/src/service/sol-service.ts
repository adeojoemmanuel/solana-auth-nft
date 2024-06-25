import { Connection, PublicKey, Keypair, Transaction, TransactionInstruction } from '@solana/web3.js';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import { Buffer } from 'buffer';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

const MY_PROGRAM_ID = "7W8iarHkr67PobvWk8SiveNRG38ywtE2dwcS3tDdgu5h";
const NFT_ADDRESS = "2y3f33wjWNmkHhsYS1KF8d7Ua9drZ99SWz9HB7H6E4E4";

async function initializeAccount(userPublicKey: PublicKey, payer: Keypair | null): Promise<void> {
    if (!payer) {
        throw new Error('Payer keypair is required');
    }

    const programId = new PublicKey(MY_PROGRAM_ID);
    const instruction = new TransactionInstruction({
        keys: [{ pubkey: userPublicKey, isSigner: false, isWritable: true }],
        programId,
        data: Buffer.from([0]),
    });
    await connection.sendTransaction(new Transaction().add(instruction), [payer]);
}

async function authenticateAccount(userPublicKey: PublicKey, payer: Keypair | null): Promise<void> {
    if (!payer) {
        throw new Error('Payer keypair is required');
    }

    const programId = new PublicKey(MY_PROGRAM_ID);
    const instruction = new TransactionInstruction({
        keys: [{ pubkey: userPublicKey, isSigner: false, isWritable: true }],
        programId,
        data: Buffer.from([1]),
    });
    await connection.sendTransaction(new Transaction().add(instruction), [payer]);
}

async function deauthenticateAccount(userPublicKey: PublicKey, payer: Keypair | null): Promise<void> {
    if (!payer) {
        throw new Error('Payer keypair is required');
    }

    const programId = new PublicKey(MY_PROGRAM_ID);
    const instruction = new TransactionInstruction({
        keys: [{ pubkey: userPublicKey, isSigner: false, isWritable: true }],
        programId,
        data: Buffer.from([2]),
    });
    await connection.sendTransaction(new Transaction().add(instruction), [payer]);
}

async function fetchUserNFTs(userPublicKey: PublicKey, keypairHolder: Keypair | null): Promise<{ nftPromises: Promise<any>[], nfts: any[] }> {
    if (!keypairHolder) {
        throw new Error('Keypair holder is required');
    }

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(userPublicKey, {
        programId: new PublicKey(NFT_ADDRESS)
    });

    const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(keypairHolder));

    const nftPromises = tokenAccounts.value.map(async (tokenAccount) => {
        const mintAddress = new PublicKey(tokenAccount.account.data.parsed.info.mint);
        const nft = await metaplex.nfts().findByMint({ mintAddress });
        return nft;
    });

    const nfts = await Promise.all(nftPromises);
    return { nftPromises, nfts };
}

export {
    initializeAccount,
    authenticateAccount,
    deauthenticateAccount,
    fetchUserNFTs,
};
