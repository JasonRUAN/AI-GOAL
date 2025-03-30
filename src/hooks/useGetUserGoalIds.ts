import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import toast from "react-hot-toast";

export function useGetUserGoalIds(parentId: string) {
    const account = useCurrentAccount();

    const {
        data: userGoalIds,
        isPending,
        error,
    } = useSuiClientQuery(
        "getDynamicFields",
        {
            parentId,
        },
        {
            enabled: !!account,
        }
    );

    if (!account) {
        return;
    }

    if (error) {
        toast.error(`get user goals failed: ${error.message}`);
        return;
    }

    if (isPending || !userGoalIds) {
        toast.error("loading data...");
        return;
    }

    return userGoalIds;
}
