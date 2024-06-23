// pages/index.tsx
import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import Image from 'next/image';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { fetchUserNFTs } from './../../service/sol-service';

const userPublicKey = new PublicKey('YOUR_USER_PUBLIC_KEY');

const UserNft = () => {
    const [nfts, setNfts] = useState<any[]>([]);

    useEffect(() => {
        const fetchNFTs = async () => {
            const fetchedNFTs = await fetchUserNFTs(userPublicKey);
            setNfts(fetchedNFTs);
        };

        fetchNFTs();
    }, []);

    return (
        <div>
            <h1>User NFTs</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {nfts.map((nft, index) => (
                    <div key={index} style={{ margin: '10px' }}>
                        <Image
                            src={nft.data.uri}
                            alt={nft.data.name}
                            width={200}
                            height={200}
                            quality={75}
                            layout="responsive"
                        />
                        <p>{nft.data.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserNft;
