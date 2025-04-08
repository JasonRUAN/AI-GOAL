import { CLOCK_OBJECT_ID } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { CONSTANTS } from "../constants";
import { useTransactionExecution } from "@/hooks/useTransactionExecution";

interface UpdateProgressInfo {
    goalId: number;
    content: string;
    percentage: number;
    proofFileBlobId: string;
}

export function useUpdateProgress() {
    const account = useCurrentAccount();
    const executeTransaction = useTransactionExecution();

    return useMutation({
        mutationFn: async (info: UpdateProgressInfo) => {
            if (!account?.address) {
                throw new Error("You need to connect your wallet first pls!");
            }

            const tx = new Transaction();

            tx.moveCall({
                target: CONSTANTS.AI_GOAL_CONTRACT.TARGET_UPDATE_PROGRESS,
                arguments: [
                    tx.object(
                        CONSTANTS.AI_GOAL_CONTRACT.AI_GOAL_SHARED_OBJECT_ID
                    ),
                    tx.object(
                        CONSTANTS.AI_GOAL_CONTRACT
                            .AIG_TOKEN_VAULT_SHARED_OBJECT_ID
                    ),
                    tx.pure.u64(info.goalId),
                    tx.pure.string(info.content),
                    tx.pure.u64(info.percentage),
                    tx.pure.string(info.proofFileBlobId),
                    tx.object(CLOCK_OBJECT_ID),
                ],
            });

            return executeTransaction(tx);
        },
        onError: (error) => {
            console.error("Failed to update progress:", error);
            throw error;
        },
        onSuccess: (data) => {
            console.log(
                "Successfully updated progress:",
                JSON.stringify(data, null, 2)
            );
        },
    });
}
