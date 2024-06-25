import { Connection, clusterApiUrl, PublicKey, Keypair, Transaction, TransactionInstruction } from '@solana/web3.js';
import { Metaplex, keypairIdentity, walletAdapterIdentity } from '@metaplex-foundation/js';
import { Buffer } from 'buffer';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

const PAYER_SECRET_KEY_BASE64 = 'GjCbG6tFdW2MbWXxqfgn79MbVqW+yMCT+kRL4JgRqms=';
const wallet = Keypair.generate();
const payer = Keypair.fromSecretKey(new Uint8Array(Buffer.from(PAYER_SECRET_KEY_BASE64, 'base64')));
const YOUR_PROGRAM_ID = "EvrVb8xTURBJJi41ogioxxi64p3YaZmDTPpN3M6CXi7G";
const NFT_ADDRESS = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

async function initializeAccount(userPublicKey: PublicKey): Promise<void> {
    const programId = new PublicKey(YOUR_PROGRAM_ID);
    const instruction = new TransactionInstruction({
        keys: [{ pubkey: userPublicKey, isSigner: false, isWritable: true }],
        programId,
        data: Buffer.from([0]),
    });
    await connection.sendTransaction(new Transaction().add(instruction), [payer]);
}

async function authenticateAccount(userPublicKey: PublicKey): Promise<void> {
    const programId = new PublicKey(YOUR_PROGRAM_ID);
    const instruction = new TransactionInstruction({
        keys: [{ pubkey: userPublicKey, isSigner: false, isWritable: true }],
        programId,
        data: Buffer.from([1]),
    });
    await connection.sendTransaction(new Transaction().add(instruction), [payer]);
}

async function deauthenticateAccount(userPublicKey: PublicKey): Promise<void> {
    const programId = new PublicKey(YOUR_PROGRAM_ID);
    const instruction = new TransactionInstruction({
        keys: [{ pubkey: userPublicKey, isSigner: false, isWritable: true }],
        programId,
        data: Buffer.from([2]),
    });
    await connection.sendTransaction(new Transaction().add(instruction), [payer]);
}

async function fetchUserNFTs(userPublicKey: PublicKey): Promise<{ nftPromises: Promise<any>[], nfts: any[] }> {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(userPublicKey, {
        programId: new PublicKey(NFT_ADDRESS)
    });

    const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(wallet));

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
