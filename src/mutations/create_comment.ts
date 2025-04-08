import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Transaction } from "@mysten/sui/transactions";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { CLOCK_OBJECT_ID, CONSTANTS, QueryKey } from "../constants";
import { useTransactionExecution } from "@/hooks/useTransactionExecution";

interface CommentInfo {
    goalId: number;
    content: string;
}

export function useCreateComment() {
    const account = useCurrentAccount();
    const executeTransaction = useTransactionExecution();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (info: CommentInfo) => {
            if (!account?.address) {
                throw new Error("You need to connect your wallet first pls!");
            }

            const tx = new Transaction();

            tx.moveCall({
                target: CONSTANTS.AI_GOAL_CONTRACT.TARGET_CREATE_COMMENT,
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
                    tx.object(CLOCK_OBJECT_ID),
                ],
            });

            return executeTransaction(tx);
        },
        onError: (error) => {
            console.error("Failed to create Comment:", error);
            throw error;
        },
        onSuccess: (data, variables) => {
            console.log("Successfully created Comment:", data);

            // 使用精确的goalId使评论列表缓存失效
            queryClient.invalidateQueries({
                queryKey: [
                    QueryKey.GetGoalCommentsQueryKey,
                    variables.goalId.toString(),
                ],
            });

            // 同时使目标数据缓存失效，以获取最新的评论计数器
            queryClient.invalidateQueries({
                queryKey: [
                    QueryKey.GetOneGoalQueryKey,
                    variables.goalId.toString(),
                ],
            });
        },
    });
}
