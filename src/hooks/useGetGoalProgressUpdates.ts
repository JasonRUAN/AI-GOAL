import { GoalFields, ProgressUpdateFields } from "@/types/move";
import { useGetOneGoal } from "./useGetOneGoal";
import { getDynamicFieldObject } from "@/lib/suiClient";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/constants";

export function useGetGoalProgressUpdates({ goalId }: { goalId: string }) {
    const { data: goal } = useGetOneGoal({ goalId });

    const goalProgressUpdatesParentId =
        goal && (goal as GoalFields).fields?.progress_updates?.fields?.id?.id;

    const progressUpdateCounter =
        goal && (goal as GoalFields).fields?.progress_update_counter;

    return useQuery({
        queryKey: [
            QueryKey.GetGoalProgressUpdatesQueryKey,
            goalId,
            progressUpdateCounter,
        ],
        queryFn: async () => {
            if (!goalProgressUpdatesParentId || !progressUpdateCounter) {
                return [];
            }

            try {
                const progressUpdatesArray: ProgressUpdateFields[] = [];
                // 从0开始获取到commentCounter的所有评论
                for (let i = 0; i < Number(progressUpdateCounter); i++) {
                    const result = await getDynamicFieldObject({
                        parentId: goalProgressUpdatesParentId as string,
                        fieldType: "u64",
                        fieldValue: String(i),
                    });
                    if (result) {
                        progressUpdatesArray.push(
                            result as ProgressUpdateFields
                        );
                    }
                }
                return progressUpdatesArray;
            } catch (err) {
                console.error("获取进度更新失败:", err);
                throw err instanceof Error
                    ? err
                    : new Error("获取进度更新失败");
            }
        },
        enabled:
            !!goalProgressUpdatesParentId &&
            !!progressUpdateCounter &&
            Number(progressUpdateCounter) > 0,
        staleTime: 30 * 1000, // 30秒内数据视为新鲜
        refetchOnWindowFocus: false, // 禁用窗口聚焦时自动刷新
    });
}
