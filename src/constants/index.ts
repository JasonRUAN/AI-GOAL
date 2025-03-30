import aiGoalContract from "../../ai-goal-contract.json";

export enum QueryKey {
    GetMyGoalsQueryKey = "GetMyGoalsQueryKey",
    GetOneGoalQueryKey = "GetOneGoalQueryKey",
    GetMultipleGoalsQueryKey = "GetMultipleGoalsQueryKey",
}

export const CONSTANTS = {
    AI_GOAL_CONTRACT: {
        TARGET_CREATE_GOAL: `${aiGoalContract.packageId}::ai_goal::create_goal`,
        TARGET_COMPLETE_GOAL: `${aiGoalContract.packageId}::ai_goal::complete_goal`,
        TARGET_FAIL_GOAL: `${aiGoalContract.packageId}::ai_goal::fail_goal`,
        TARGET_CONFIRM_WITNESS: `${aiGoalContract.packageId}::ai_goal::confirm_witness`,
        AI_GOAL_SHARED_OBJECT_ID: aiGoalContract.aiGoalSharedObjectId,
    },
    WALRUS: {
        PUBLISHER_URL: "https://publisher.walrus-testnet.walrus.space",
        AGGREGATOR_URL: "https://aggregator.walrus-testnet.walrus.space",
    },
    ELIZA_BASE_URL: "http://localhost:3001",
    BACKEND_URL: "http://localhost:5050",
};
