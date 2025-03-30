export type GoalManager = {
    active_goals: string[];
    balance: string;
    completed_goals: string[];
    failed_goals: string[];
    goal_count: string;
    goals: DynamicFields;
    user_goals: DynamicFields;
};

export type UserGoalIds = {
    id: {
        id: string;
    };
    name: string;
    value: string[];
};

export type DynamicFields = {
    type: string;
    fields: {
        id: {
            id: string;
        };
        size: string;
    };
};

export type GoalFields = {
    type: string;
    fields: GoalDetail;
};

export type GoalDetail = {
    ai_suggestion: string;
    amount: string;
    comment_counter: string;
    comments: DynamicFields;
    confirmations: string[];
    created_at: string;
    creator: string;
    deadline: string;
    description: string;
    id: string;
    progress_percentage: number;
    progress_update_counter: string;
    progress_updates: DynamicFields;
    status: number;
    title: string;
    witnesses: string[];
};
