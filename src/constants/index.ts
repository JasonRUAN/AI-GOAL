import aiGoalContract from "../../ai-goal-contract.json";

export enum QueryKey {
    GetMyGoalsQueryKey = "GetMyGoalsQueryKey",
    GetOneGoalQueryKey = "GetOneGoalQueryKey",
    GetMultipleGoalsQueryKey = "GetMultipleGoalsQueryKey",
    GetGoalCommentsQueryKey = "GetGoalCommentsQueryKey",
    GetGoalProgressUpdatesQueryKey = "GetGoalProgressUpdatesQueryKey",
}

export const CLOCK_OBJECT_ID = "0x6";

export const SUI_COIN_TYPE = "0x2::sui::SUI";
export const AIG_COIN_TYPE = `${aiGoalContract.packageId}::aig_token::AIG_TOKEN`;

export const CONSTANTS = {
    AI_GOAL_CONTRACT: {
        TARGET_CREATE_GOAL: `${aiGoalContract.packageId}::ai_goal::create_goal`,
        TARGET_CONFIRM_WITNESS: `${aiGoalContract.packageId}::ai_goal::confirm_witness`,
        TARGET_COMPLETE_GOAL: `${aiGoalContract.packageId}::ai_goal::complete_goal`,
        TARGET_FAIL_GOAL: `${aiGoalContract.packageId}::ai_goal::fail_goal`,
        TARGET_CREATE_AGENT: `${aiGoalContract.packageId}::ai_goal::create_agent`,
        TARGET_UPDATE_AGENT: `${aiGoalContract.packageId}::ai_goal::update_agent`,
        TARGET_UPDATE_PROGRESS: `${aiGoalContract.packageId}::ai_goal::update_progress`,
        TARGET_CREATE_COMMENT: `${aiGoalContract.packageId}::ai_goal::create_comment`,
        PACKAGE_ID: aiGoalContract.packageId,
        MODULE_NAME: "aig_token",
        AI_GOAL_SHARED_OBJECT_ID: aiGoalContract.aiGoalSharedObjectId,
        AIG_TOKEN_VAULT_SHARED_OBJECT_ID:
            aiGoalContract.aigTokenVaultSharedObjectId,
    },
    WALRUS: {
        PUBLISHER_URL: "https://publisher.walrus-testnet.walrus.space",
        AGGREGATOR_URL: "https://aggregator.walrus-testnet.walrus.space",
    },
    // ELIZA_BASE_URL: "http://localhost:3001",
    ELIZA_BASE_URL:
        "https://912a9ee0476329a340c214c0363d978bf252ff8c-3001.dstack-prod5.phala.network",
    // BACKEND_URL: "http://localhost:5050",
    BACKEND_URL: "http://195.201.111.229:5050",
    // BACKEND_URL:
    //     "https://c46307fd94aaf26c0e093e1c12e615f2badc1192-5050.dstack-prod5.phala.network",
};
