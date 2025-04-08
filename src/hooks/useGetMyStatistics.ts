import { useCurrentAccount } from "@mysten/dapp-kit";
import { CONSTANTS } from "@/constants";
import { useGetObject } from "./useGetObject";
import type { SuiParsedData } from "@mysten/sui/client";
import type { GoalManager } from "@/types/move";
import { useGetDynamicFieldObject } from "./useGetDynamicFieldObject";
import type { MoveValue } from "@mysten/sui/client";

export function useGetMyStatistics() {
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

    const activeGoals = goalManager?.active_goals || [];
    const completedGoals = goalManager?.completed_goals || [];
    const failedGoals = goalManager?.failed_goals || [];

    const { data: userGoalIds } = useGetDynamicFieldObject({
        parentId: userGoalParentId || "",
        fieldType: "address",
        fieldValue: account?.address || "",
    });

    // 统计目标数量
    const statistics = {
        active: 0,
        completed: 0,
        failed: 0,
        total: 0,
    };

    console.log(`goalManager: ${JSON.stringify(goalManager, null, 2)}`);

    console.log(
        `activeGoals: ${JSON.stringify(
            activeGoals,
            null,
            2
        )}, completedGoals: ${JSON.stringify(
            completedGoals,
            null,
            2
        )}, failedGoals: ${JSON.stringify(failedGoals, null, 2)}`
    );

    console.log(`userGoalIds: ${JSON.stringify(userGoalIds, null, 2)}`);

    if (Array.isArray(userGoalIds)) {
        userGoalIds.forEach((goalId: MoveValue) => {
            if (typeof goalId === "string") {
                if (activeGoals.includes(goalId)) {
                    statistics.active++;
                } else if (completedGoals.includes(goalId)) {
                    statistics.completed++;
                } else if (failedGoals.includes(goalId)) {
                    statistics.failed++;
                }
            }
        });
        statistics.total =
            statistics.active + statistics.completed + statistics.failed;
    }

    return {
        data: statistics,
        isLoading: false,
        error: null,
    };
}
