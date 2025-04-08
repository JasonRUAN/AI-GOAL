import { CONSTANTS } from "@/constants";
import { useGetObject } from "./useGetObject";
import type { GoalManager } from "@/types/move";
import type { SuiParsedData } from "@mysten/sui/client";

export function useGetGoal2AgentParentId() {
    const objectsData = useGetObject({
        objectId: CONSTANTS.AI_GOAL_CONTRACT.AI_GOAL_SHARED_OBJECT_ID,
    });

    const parsedGoals = objectsData?.data?.content as SuiParsedData | undefined;
    const goalManager =
        parsedGoals && "fields" in parsedGoals
            ? (parsedGoals.fields as GoalManager)
            : undefined;

    const goal2AgentParentId = goalManager?.goal_2_agent?.fields?.id?.id;

    return goal2AgentParentId;
}
