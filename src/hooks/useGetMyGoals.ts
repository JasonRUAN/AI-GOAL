import { useCurrentAccount } from "@mysten/dapp-kit";
import { CONSTANTS } from "@/constants";
import { useGetObject } from "./useGetObject";
import type { SuiParsedData } from "@mysten/sui/client";
import type { GoalManager } from "@/types/move";
import { useGetDynamicFieldObject } from "./useGetDynamicFieldObject";
import { useGetMultipleGoals } from "./useGetMultipleGoals";

export function useGetMyGoals() {
    const account = useCurrentAccount();

    const objectsData = useGetObject({
        objectId: CONSTANTS.AI_GOAL_CONTRACT.AI_GOAL_SHARED_OBJECT_ID,
    });

    // 提前解析数据，以便获取userGoalParentId
    const parsedGoals = objectsData?.data?.content as SuiParsedData | undefined;
    const goalManager =
        parsedGoals && "fields" in parsedGoals
            ? (parsedGoals.fields as GoalManager)
            : undefined;
    const userGoalParentId = goalManager?.user_goals?.fields?.id?.id;
    const goalParentId = goalManager?.goals?.fields?.id?.id;

    // console.log(">>>>>>>>>>>> ", userGoalParentId, goalParentId);

    const { data: userGoalIds } = useGetDynamicFieldObject({
        parentId: userGoalParentId || "",
        fieldType: "address",
        fieldValue: account?.address || "",
    });

    // console.log(">>>>>>>>>>>> ", userGoalIds);

    const { data: goals } = useGetMultipleGoals({
        parentId: goalParentId || "",
        goalIds: userGoalIds as string[],
    });

    // console.log(JSON.stringify(goals, null, 2));

    return {
        data: goals || [],
        isLoading: false,
        error: null,
    };
}
