import { useGetDynamicFieldObject } from "./useGetDynamicFieldObject";
import { useGetGoal2AgentParentId } from "./useGetGoal2AgentParentId";

export function useGetGoalAgentId({ goalId }: { goalId: string }) {
    const goal2AgentParentId = useGetGoal2AgentParentId();
    // console.log(">>>", goal2AgentParentId);

    return useGetDynamicFieldObject({
        parentId: goal2AgentParentId as string,
        fieldType: "u64",
        fieldValue: goalId,
    });
}
