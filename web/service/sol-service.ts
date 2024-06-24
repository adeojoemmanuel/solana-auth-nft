import { Connection, clusterApiUrl,  PublicKey, Keypair, Transaction, TransactionInstruction } from '@solana/web3.js';
import { Metaplex, keypairIdentity, walletAdapterIdentity } from '@metaplex-foundation/js';
import { Metadata, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { Buffer } from 'buffer';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');


const PAYER_SECRET_KEY_BASE64 = 'GjCbG6tFdW2MbWXxqfgn79MbVqW+yMCT+kRL4JgRqms=';
const wallet = Keypair.generate();
const payer = Keypair.fromSecretKey(new Uint8Array(Buffer.from(PAYER_SECRET_KEY_BASE64, 'base64')));
const YOUR_PROGRAM_ID = "";
const NFT_ADDRESS = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
// const metaplex = Metaplex.make(connection).use(keypairIdentity(payer)).use(bundlrStorage());

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

async function fetchUserNFTs(userPublicKey: PublicKey): Promise<any[]> {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(userPublicKey, {
        programId: new PublicKey(NFT_ADDRESS)
    });

    const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))

    let mintAddress: any;

    const nftMetadataPromises = tokenAccounts.value.map(async (tokenAccount) => {
        mintAddress = tokenAccount.account.data.parsed.info.mint;
        const metadataPDA = await Metadata.getPDA(new PublicKey(mintAddress));
        const metadataAccount = await Metadata.load(connection, metadataPDA);
        return metadataAccount.data;
    });

    const nftMetadata = await Promise.all(nftMetadataPromises);

    const nfts = await Promise.all(nftMetadata.map(async (metadata) => {
        mintAddress = metadata.mint;
        const nft = await metaplex.nfts().findByMint({ mintAddress });
        return {
            metadata,
            nft
        };
    }));

    return nfts;
}




export {
    initializeAccount,
    authenticateAccount,
    deauthenticateAccount,
    fetchUserNFTs,
};
