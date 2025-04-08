import { useGetDynamicFieldObject } from "./useGetDynamicFieldObject";
import { CONSTANTS } from "@/constants";

export function useGetAgent({ agentId }: { agentId: string }) {
    return useGetDynamicFieldObject({
        parentId: CONSTANTS.AI_GOAL_CONTRACT.AI_GOAL_SHARED_OBJECT_ID,
        fieldType: "string",
        fieldValue: agentId,
    });
}
