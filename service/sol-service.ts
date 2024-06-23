import { Connection, PublicKey, Keypair, Transaction, TransactionInstruction } from '@solana/web3.js';
import { Metaplex, keypairIdentity, walletAdapterIdentity } from '@metaplex-foundation/js';
import { Metadata, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { Buffer } from 'buffer';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Example base64 encoded secret key
const YOUR_PAYER_SECRET_KEY_BASE64 = 'YOUR_BASE64_ENCODED_SECRET_KEY'; // Replace with your actual base64 secret key

const payer = Keypair.fromSecretKey(new Uint8Array(Buffer.from(YOUR_PAYER_SECRET_KEY_BASE64, 'base64')));

// const metaplex = Metaplex.make(connection).use(keypairIdentity(payer)).use(bundlrStorage());

async function initializeAccount(userPublicKey: PublicKey): Promise<void> {
    const programId = new PublicKey('YOUR_PROGRAM_ID');
    const instruction = new TransactionInstruction({
        keys: [{ pubkey: userPublicKey, isSigner: false, isWritable: true }],
        programId,
        data: Buffer.from([0]), // Initialize instruction selector
    });
    await connection.sendTransaction(new Transaction().add(instruction), [payer]);
}

async function authenticateAccount(userPublicKey: PublicKey): Promise<void> {
    const programId = new PublicKey('YOUR_PROGRAM_ID');
    const instruction = new TransactionInstruction({
        keys: [{ pubkey: userPublicKey, isSigner: false, isWritable: true }],
        programId,
        data: Buffer.from([1]), // Authenticate instruction selector
    });
    await connection.sendTransaction(new Transaction().add(instruction), [payer]);
}

async function deauthenticateAccount(userPublicKey: PublicKey): Promise<void> {
    const programId = new PublicKey('YOUR_PROGRAM_ID');
    const instruction = new TransactionInstruction({
        keys: [{ pubkey: userPublicKey, isSigner: false, isWritable: true }],
        programId,
        data: Buffer.from([2]), // Deauthenticate instruction selector
    });
    await connection.sendTransaction(new Transaction().add(instruction), [payer]);
}

async function fetchUserNFTs(userPublicKey: PublicKey): Promise<any[]> {
    // Fetch all token accounts owned by the user
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(userPublicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
    });

    const nftMetadataPromises = tokenAccounts.value.map(async (tokenAccount) => {
        const mintAddress = tokenAccount.account.data.parsed.info.mint;
        const metadataPDA = await Metadata.getPDA(new PublicKey(mintAddress));
        const metadataAccount = await Metadata.load(connection, metadataPDA);
        return metadataAccount.data;
    });

    return await Promise.all(nftMetadataPromises);
}

export {
    initializeAccount,
    authenticateAccount,
    deauthenticateAccount,
    fetchUserNFTs,
};
