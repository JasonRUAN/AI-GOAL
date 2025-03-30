import { useCurrentAccount } from "@mysten/dapp-kit";
import { CONSTANTS } from "@/constants";
import { useGetObject } from "./useGetObject";
import { SuiParsedData } from "@mysten/sui/client";
import { GoalManager } from "@/types/move";
import { useGetDynamicFieldObject } from "./useGetDynamicFieldObject";
import { useGetMultipleGoals } from "./useGetMultipleGoals";

export function useGetMyGoals() {
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
    const goalParentId = goalManager?.goals?.fields?.id?.id;

    // console.log(">>>>>>>>>>>> ", userGoalParentId, goalParentId);

    const { data: userGoalIds } = useGetDynamicFieldObject({
        parentId: userGoalParentId || "",
        fieldType: "address",
        fieldValue: account?.address || "",
    });

    // console.log(">>>>>>>>>>>> ", userGoalIds);

    // const parsedUserGoalIds = userGoalIdsObject?.content as
    //     | SuiParsedData
    //     | undefined;
    // const userGoalIdsFields =
    //     parsedUserGoalIds && "fields" in parsedUserGoalIds
    //         ? (parsedUserGoalIds.fields as UserGoalIds)
    //         : undefined;
    // const userGoalIds = userGoalIdsFields?.value;

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

    // const queryKey = [QueryKey.GetMyGoalsQueryKey, address];

    // // 获取对象ID列表
    // const {
    //     data: objectsData,
    //     isPending: isObjectsLoading,
    //     error: objectsError,
    //     refetch: refetchObjects,
    // } = useSuiClientQuery(
    //     "getOwnedObjects",
    //     {
    //         owner: address || account?.address || "",
    //     },
    //     {
    //         enabled: !!address || !!account?.address,
    //         queryKey,
    //         staleTime: 0,
    //     }
    // );

    // return useQuery({
    //     queryKey: ["goals", account?.address],
    //     queryFn: async (): Promise<Goal[]> => {
    //         if (!account?.address) {
    //             throw new Error("请先连接钱包！");
    //         }

    //         // TODO: 这里替换为实际的链上调用
    //         // 目前返回模拟数据
    //         return [
    //             {
    //                 id: "1",
    //                 title: "每天跑步5公里",
    //                 description: "为了保持健康的生活方式，每天早上跑步5公里",
    //                 deadline: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30天后
    //                 amount: 0.1,
    //                 witnesses: ["0x1234567890abcdef1234567890abcdef12345678"],
    //                 ai_suggestion:
    //                     "建议您制定详细的跑步计划，包括热身和拉伸环节，并记录每天的跑步数据。",
    //                 status: "pending",
    //                 progress: 30,
    //             },
    //             {
    //                 id: "2",
    //                 title: "学习编程",
    //                 description: "每天学习2小时编程，完成一个个人项目",
    //                 deadline: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60天后
    //                 amount: 0.2,
    //                 witnesses: ["0x1234567890abcdef1234567890abcdef12345678"],
    //                 ai_suggestion:
    //                     "建议您设定每周的具体学习目标，并在GitHub上记录您的进度。",
    //                 status: "pending",
    //                 progress: 45,
    //             },
    //             {
    //                 id: "3",
    //                 title: "学习编程",
    //                 description: "每天学习2小时编程，完成一个个人项目",
    //                 deadline: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60天后
    //                 amount: 0.2,
    //                 witnesses: ["0x1234567890abcdef1234567890abcdef12345678"],
    //                 ai_suggestion:
    //                     "建议您设定每周的具体学习目标，并在GitHub上记录您的进度。",
    //                 status: "pending",
    //                 progress: 45,
    //             },
    //             {
    //                 id: "4",
    //                 title: "学习编程",
    //                 description: "每天学习2小时编程，完成一个个人项目",
    //                 deadline: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60天后
    //                 amount: 0.2,
    //                 witnesses: ["0x1234567890abcdef1234567890abcdef12345678"],
    //                 ai_suggestion:
    //                     "建议您设定每周的具体学习目标，并在GitHub上记录您的进度。",
    //                 status: "pending",
    //                 progress: 45,
    //             },
    //         ];
    //     },
    //     enabled: !!account?.address,
    // });
}
