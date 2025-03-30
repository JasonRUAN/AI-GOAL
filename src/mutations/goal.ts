import { useMutation } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { CONSTANTS } from "../constants";
import { useTransactionExecution } from "@/hooks/useTransactionExecution";
import { bcs } from "@mysten/sui/bcs";

interface GoalInfo {
    title: string;
    description: string;
    ai_suggestion: string;
    deadline: number;
    witnesses: string[];
    amount: number;
}

export interface Goal extends GoalInfo {
    id: string;
    status: "pending" | "completed" | "failed";
    progress?: number;
}

export function useCreateGoal() {
    const account = useCurrentAccount();
    const executeTransaction = useTransactionExecution();

    return useMutation({
        mutationFn: async (info: GoalInfo) => {
            if (!account?.address) {
                throw new Error("You need to connect your wallet first pls!");
            }

            const tx = new Transaction();

            tx.moveCall({
                target: CONSTANTS.AI_GOAL_CONTRACT.TARGET_CREATE_GOAL,
                arguments: [
                    tx.object(
                        CONSTANTS.AI_GOAL_CONTRACT.AI_GOAL_SHARED_OBJECT_ID
                    ),
                    tx.pure.string(info.title),
                    tx.pure.string(info.description),
                    tx.pure.string(info.ai_suggestion),
                    tx.pure.u64(info.deadline),
                    tx.pure(bcs.vector(bcs.Address).serialize(info.witnesses)),
                    tx.pure.u64(info.amount * 10 ** 9),
                    tx.object(tx.gas),
                    tx.object("0x6"),
                ],
            });

            return executeTransaction(tx);
        },
        onError: (error) => {
            console.error("Failed to create Goal:", error);
            throw error;
        },
        onSuccess: (data) => {
            console.log("Successfully created Goal:", data);
        },
    });
}
