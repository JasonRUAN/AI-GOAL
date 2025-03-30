import { useSuiClientQuery } from "@mysten/dapp-kit";
import toast from "react-hot-toast";

interface DynamicFieldObject {
    parentId: string;
    fieldType: string;
    fieldValue: string;
}

export function useGetDynamicFieldObject({
    parentId,
    fieldType,
    fieldValue,
}: DynamicFieldObject) {
    // const { data, isPending, error } = useSuiClientQuery(
    return useSuiClientQuery(
        "getDynamicFieldObject",
        {
            parentId: parentId,
            name: {
                type: fieldType,
                value: fieldValue,
            },
        },
        {
            enabled: !!parentId && !!fieldType && !!fieldValue,
            // select: (data) => data.data,
            select: (data) => {
                if (data.data?.content && "fields" in data.data.content) {
                    if (
                        data.data.content.fields &&
                        "value" in data.data.content.fields
                    ) {
                        // return (data.data.content.fields.value as GoalFields)
                        //     .fields;
                        return data.data.content.fields.value;
                    }
                }
                return null;
            },
        }
    );

    // if (error) {
    //     toast.error(`get dynamic field object failed: ${error.message}`);
    //     return;
    // }

    // if (isPending || !data) {
    //     toast.error("loading data...");
    //     return;
    // }

    // return data;
}
