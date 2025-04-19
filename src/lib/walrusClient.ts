import { WalrusClient } from "@mysten/walrus";
import { suiClient, ACTIVE_NETWORK } from "@/providers/NetworkConfig";
import type { Keypair } from "@mysten/sui/cryptography";

const walrusClient = new WalrusClient({
    network: ACTIVE_NETWORK,
    suiClient,
});

export async function retrieveBlob(blobId: string) {
    const blobBytes = await walrusClient.readBlob({ blobId });
    return new Blob([new Uint8Array(blobBytes)]);
}

export async function writeBlob(keypair: Keypair, content: string) {
    const { blobId } = await walrusClient.writeBlob({
        blob: new TextEncoder().encode(content),
        deletable: false,
        epochs: 50,
        signer: keypair,
    });
    return blobId;
}

export async function writeFileBlob(keypair: Keypair, file: File) {
    const fileBuffer = await file.arrayBuffer();
    const { blobId } = await walrusClient.writeBlob({
        blob: new Uint8Array(fileBuffer),
        deletable: false,
        epochs: 50,
        signer: keypair,
    });
    return blobId;
}
