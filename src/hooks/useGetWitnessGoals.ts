import { useCurrentAccount } from "@mysten/dapp-kit";
import { CONSTANTS } from "@/constants";
import { useGetObject } from "./useGetObject";
import type { SuiParsedData } from "@mysten/sui/client";
import type { GoalManager } from "@/types/move";
import { useGetDynamicFieldObject } from "./useGetDynamicFieldObject";
import { useGetMultipleGoals } from "./useGetMultipleGoals";

export function useGetWitnessGoals() {
    const account = useCurrentAccount();

    const objectsData = useGetObject({
        objectId: CONSTANTS.AI_GOAL_CONTRACT.AI_GOAL_SHARED_OBJECT_ID,
    });

    // 提前解析数据，以便获取witnessGoalParentId
    const parsedGoals = objectsData?.data?.content as SuiParsedData | undefined;
    const goalManager =
        parsedGoals && "fields" in parsedGoals
            ? (parsedGoals.fields as GoalManager)
            : undefined;
    const witnessGoalParentId = goalManager?.witness_goals?.fields?.id?.id;
    const goalParentId = goalManager?.goals?.fields?.id?.id;

    const { data: witnessGoalIds } = useGetDynamicFieldObject({
        parentId: witnessGoalParentId || "",
        fieldType: "address",
        fieldValue: account?.address || "",
    });

    const { data: goals } = useGetMultipleGoals({
        parentId: goalParentId || "",
        goalIds: witnessGoalIds as string[],
    });

    return {
        data: goals || [],
        isLoading: false,
        error: null,
    };
}
