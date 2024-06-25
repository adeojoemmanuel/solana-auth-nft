import React, { useState, useEffect } from 'react';
import { fetchUserNFTs } from './../src/service/sol-service';
import { PublicKey } from '@solana/web3.js';
import { getKeypairFromFile } from "@solana-developers/helpers";

function App() {
    const [nfts, setNFTs] = useState<string[]>([]);
    const [walletAddress, setWalletAddress] = useState('');

    const pathToPayerKeyPair = async (): Promise<PublicKey> => {
      const keypair = await getKeypairFromFile("./personal-wallet.json");
      return keypair.publicKey;
  };

  useEffect(() => {
    async function fetchNFTs() {
        try {
            const fetchedNFTs = await fetchUserNFTs(await pathToPayerKeyPair());
            if (Array.isArray(fetchedNFTs) && fetchedNFTs.every(item => typeof item === 'string')) {
                setNFTs(fetchedNFTs);
            } else {
                console.error('Returned NFTs are not in the expected format:', fetchedNFTs);
            }
        } catch (error) {
            console.error('Error fetching NFTs:', error);
        }
    }

    if (walletAddress) {
        fetchNFTs();
    }
}, [walletAddress]);
    return (
        <div>
            <h1>Solana NFT Viewer</h1>
            <input type="text" placeholder="Enter wallet address" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
            <div>
                {nfts.length > 0 ? (
                    nfts.map((nft, index) => (
                        <div key={index}>
                            {/* Display NFTs here */}
                            <p>NFT: {nft}</p>
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
