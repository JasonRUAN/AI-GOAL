import { CONSTANTS } from "@/constants";
import { useGetObject } from "./useGetObject";
import { GoalManager } from "@/types/move";
import { SuiParsedData } from "@mysten/sui/client";

export function useGetGoalParentId() {
    const objectsData = useGetObject({
        objectId: CONSTANTS.AI_GOAL_CONTRACT.AI_GOAL_SHARED_OBJECT_ID,
    });

    const parsedGoals = objectsData?.data?.content as SuiParsedData | undefined;
    const goalManager =
        parsedGoals && "fields" in parsedGoals
            ? (parsedGoals.fields as GoalManager)
            : undefined;

    const goalParentId = goalManager?.goals?.fields?.id?.id;

    return goalParentId;
}
