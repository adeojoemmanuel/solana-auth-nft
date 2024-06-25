import React, { useState, useEffect } from 'react';
import { initializeAccount, authenticateAccount, deauthenticateAccount, fetchUserNFTs } from '../src/service/sol-service';
import { Keypair, PublicKey } from '@solana/web3.js';
import { getKeypairFromFile } from "@solana-developers/helpers";

function App() {
    const [nfts, setNFTs] = useState<any[]>([]);
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [userPublicKey, setUserPublicKey] = useState<PublicKey | null>(null);
    const [keypair, setKeyPair] = useState<Keypair | null>(null);

    useEffect(() => {
        async function fetchNFTs() {
            if (walletAddress) {
                try {
                    const publicKey = await pathToPayerKeyPair();
                    let keypair = await getKeypairFromFile("./personal-wallet.json");

                    setUserPublicKey(publicKey);
                    setKeyPair(keypair);

                    const { nfts } = await fetchUserNFTs(publicKey, keypair);
                    setNFTs(nfts);
                } catch (error) {
                    console.error('Error fetching NFTs:', error);
                }
            }
        }


        fetchNFTs();
    }, [walletAddress, keypair, userPublicKey]);

    const pathToPayerKeyPair = async (): Promise<PublicKey> => {
        const keypair = await getKeypairFromFile("./personal-wallet.json");
        return keypair.publicKey;
    };

    const handleInitializeAccount = async () => {
        if (userPublicKey) {
            try {
                await initializeAccount(userPublicKey, keypair);
                console.log('Account initialized successfully.');
            } catch (error) {
                console.error('Error initializing account:', error);
            }
        }
    };

    const handleAuthenticateAccount = async () => {
        if (userPublicKey) {
            try {
                await authenticateAccount(userPublicKey, keypair);
                console.log('Account authenticated successfully.');
            } catch (error) {
                console.error('Error authenticating account:', error);
            }
        }
    };

    const handleDeauthenticateAccount = async () => {
        if (userPublicKey) {
            try {
                await deauthenticateAccount(userPublicKey, keypair);
                console.log('Account deauthenticated successfully.');
            } catch (error) {
                console.error('Error deauthenticating account:', error);
            }
        }
    };

    return (
        <div>
            <h1>Solana NFT Viewer</h1>
            <input
                type="text"
                placeholder="Enter wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
            />
            <button onClick={handleInitializeAccount}>Initialize Account</button>
            <button onClick={handleAuthenticateAccount}>Authenticate Account</button>
            <button onClick={handleDeauthenticateAccount}>Deauthenticate Account</button>
            <div>
                {nfts.length > 0 ? (
                    nfts.map((nft, index) => (
                        <div key={index}>
                            {/* Display NFTs here */}
                            <p key={index}>NFT: {nft}</p>
                        </div>
                    ))
                ) : (
                    <p>No NFTs found for this wallet address.</p>
                )}
            </div>
        </div>
    );
}

export default App;
