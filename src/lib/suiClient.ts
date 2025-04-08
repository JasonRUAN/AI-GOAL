import { suiClient } from "@/providers/NetworkConfig";

interface DynamicFieldObject {
    parentId: string;
    fieldType: string;
    fieldValue: string;
}

export const getDynamicFieldObject = async ({
    parentId,
    fieldType,
    fieldValue,
}: DynamicFieldObject) => {
    const data = await suiClient.getDynamicFieldObject({
        parentId: parentId,
        name: {
            type: fieldType,
            value: fieldValue,
        },
    });

    if (data?.data?.content && "fields" in data.data.content) {
        if (data.data.content.fields && "value" in data.data.content.fields) {
            return data.data.content.fields.value;
        }
    }
};
