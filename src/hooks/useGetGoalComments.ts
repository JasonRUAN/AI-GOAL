import { CommentFields, GoalFields } from "@/types/move";
import { useGetOneGoal } from "./useGetOneGoal";
import { getDynamicFieldObject } from "@/lib/suiClient";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/constants";

export function useGetGoalComments({ goalId }: { goalId: string }) {
    const { data: goal } = useGetOneGoal({ goalId });

    const goalCommentsParentId =
        goal && (goal as GoalFields).fields?.comments?.fields?.id?.id;

    const commentCounter = goal && (goal as GoalFields).fields?.comment_counter;

    return useQuery({
        queryKey: [QueryKey.GetGoalCommentsQueryKey, goalId, commentCounter],
        queryFn: async () => {
            if (!goalCommentsParentId || !commentCounter) {
                return [];
            }

            try {
                const commentsArray: CommentFields[] = [];
                // 从0开始获取到commentCounter的所有评论
                for (let i = 0; i < Number(commentCounter); i++) {
                    const result = await getDynamicFieldObject({
                        parentId: goalCommentsParentId as string,
                        fieldType: "u64",
                        fieldValue: String(i),
                    });
                    if (result) {
                        commentsArray.push(result as CommentFields);
                    }
                }
                return commentsArray;
            } catch (err) {
                console.error("获取评论失败:", err);
                throw err instanceof Error ? err : new Error("获取评论失败");
            }
        },
        enabled:
            !!goalCommentsParentId &&
            !!commentCounter &&
            Number(commentCounter) > 0,
        staleTime: 30 * 1000, // 30秒内数据视为新鲜
        refetchOnWindowFocus: false, // 禁用窗口聚焦时自动刷新
    });
}
