import { CONSTANTS } from "@/constants";
import { useGetObject } from "./useGetObject";
import type { SuiParsedData } from "@mysten/sui/client";
import type { GoalManager } from "@/types/move";
import { useGetMultipleGoals } from "./useGetMultipleGoals";

export function useGetAllGoals() {
    const objectsData = useGetObject({
        objectId: CONSTANTS.AI_GOAL_CONTRACT.AI_GOAL_SHARED_OBJECT_ID,
    });

    // 提前解析数据，以便获取userGoalParentId
    const parsedGoals = objectsData?.data?.content as SuiParsedData | undefined;
    const goalManager =
        parsedGoals && "fields" in parsedGoals
            ? (parsedGoals.fields as GoalManager)
            : undefined;

    const activeGoalIds = goalManager?.active_goals;
    const completedGoalIds = goalManager?.completed_goals;
    const failedGoalIds = goalManager?.failed_goals;

    const goalParentId = goalManager?.goals?.fields?.id?.id;

    const userGoalIds = [
        ...(activeGoalIds || []),
        ...(completedGoalIds || []),
        ...(failedGoalIds || []),
    ];

    // console.log(JSON.stringify(userGoalIds, null, 2));

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
