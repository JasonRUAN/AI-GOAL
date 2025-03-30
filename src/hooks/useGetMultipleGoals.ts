import { QueryKey } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";
import { SuiClient } from "@mysten/sui/client";
import { GoalFields } from "@/types/move";

export function useGetMultipleGoals({
    parentId,
    goalIds,
}: {
    parentId: string;
    goalIds: string[];
}) {
    const client = useSuiClient();

    return useQuery({
        queryKey: [QueryKey.GetMultipleGoalsQueryKey, parentId, goalIds],
        queryFn: async () => {
            // 这里可以通过一次查询批量获取多个目标的数据
            const promises = goalIds.map((goalId) => {
                // 假设你有一个获取单个目标的函数
                return fetchOneGoal({
                    client,
                    parentId,
                    goalId,
                });
            });
            return Promise.all(promises);
        },
        enabled: !!parentId && !!goalIds && goalIds.length > 0,
        select: (data) => {
            return data.map((goal) => {
                if (goal.data?.content && "fields" in goal.data.content) {
                    if (
                        goal.data.content.fields &&
                        "value" in goal.data.content.fields
                    ) {
                        return (goal.data.content.fields.value as GoalFields)
                            .fields;
                    }
                }
                return null;
            });
        },
    });
}

async function fetchOneGoal({
    client,
    parentId,
    goalId,
}: {
    client: SuiClient;
    parentId: string;
    goalId: string;
}) {
    return await client.getDynamicFieldObject({
        parentId,
        name: {
            type: "u64",
            value: goalId,
        },
    });
}
