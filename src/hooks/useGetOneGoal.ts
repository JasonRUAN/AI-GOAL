import { GoalFields } from "@/types/move";
import { useGetDynamicFieldObject } from "./useGetDynamicFieldObject";
import { useGetGoalParentId } from "./useGetGoalParentId";

export function useGetOneGoal({ goalId }: { goalId: string }) {
    const goalParentId = useGetGoalParentId();
    console.log(">>>", goalParentId);

    return useGetDynamicFieldObject({
        parentId: goalParentId as string,
        fieldType: "u64",
        fieldValue: goalId,
    });
}
