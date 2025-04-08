import { CONSTANTS } from "@/constants";
import { suiClient } from "@/providers/NetworkConfig";

export async function queryEvents(sender: string) {
    try {
        const events = await suiClient.queryEvents({
            query: {
                MoveEventModule: {
                    package: CONSTANTS.AI_GOAL_CONTRACT.PACKAGE_ID,
                    module: CONSTANTS.AI_GOAL_CONTRACT.MODULE_NAME,
                },
            },
            order: "descending",
            limit: 5,
        });

        console.log("Events query successful");

        // 可以选择性地过滤出sender相关的事件
        const filteredEvents = events.data.filter(
            (event) => event.sender === sender
        );

        return {
            ...events,
            data: filteredEvents,
        };
    } catch (error) {
        console.error("Error querying events:", error);
        // 返回空结果
        return { data: [], hasNextPage: false, nextCursor: null };
    }
}
