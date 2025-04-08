import { useMutation } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { CONSTANTS } from "../constants";
import { useTransactionExecution } from "@/hooks/useTransactionExecution";

interface AgentInfo {
    goalId: number;
    agentId: string;
    agentName: string;
    characterJson: string;
}

export function useCreateAgent() {
    const account = useCurrentAccount();
    const executeTransaction = useTransactionExecution();

    return useMutation({
        mutationFn: async (info: AgentInfo) => {
            if (!account?.address) {
                throw new Error("You need to connect your wallet first pls!");
            }

            const tx = new Transaction();

            tx.moveCall({
                target: CONSTANTS.AI_GOAL_CONTRACT.TARGET_CREATE_AGENT,
                arguments: [
                    tx.object(
                        CONSTANTS.AI_GOAL_CONTRACT.AI_GOAL_SHARED_OBJECT_ID
                    ),
                    tx.object(
                        CONSTANTS.AI_GOAL_CONTRACT
                            .AIG_TOKEN_VAULT_SHARED_OBJECT_ID
                    ),
                    tx.pure.u64(info.goalId),
                    tx.pure.string(info.agentId),
                    tx.pure.string(info.agentName),
                    tx.pure.string(info.characterJson),
                ],
            });

            return executeTransaction(tx);
        },
        onError: (error) => {
            console.error("Failed to create Agent:", error);
            throw error;
        },
        onSuccess: (data) => {
            console.log("Successfully created Agent:", data);
        },
    });
}
