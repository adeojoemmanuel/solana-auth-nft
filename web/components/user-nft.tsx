import React, { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { fetchUserNFTs } from './services/nftService';

const UserNFTs: React.FC<{ userPublicKey: PublicKey }> = ({ userPublicKey }) => {
    const [userNFTs, setUserNFTs] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const nfts = await fetchUserNFTs(userPublicKey);
            setUserNFTs(nfts);
        };

        fetchData();
    }, [userPublicKey]);

    return (
        <div>
            <h2>User's NFTs</h2>
            <div>
                {userNFTs.map((nft, index) => (
                    <div key={index}>
                        <img src={nft.image} alt={nft.name} />
                        <p>{nft.name}</p>
                        <p>{nft.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserNFTs;
