module ai_goal::ai_goal {
    use std::string::{Self, String};
    use sui::clock::{Self, Clock};
    use sui::sui::SUI;
    use sui::event;
    use sui::table::{Self, Table};
    use sui::coin::{Self};
    use sui::balance::{Self, Balance};
    use sui::dynamic_object_field::{Self};
    use ai_goal::aig_token::{airdrop, Vault};

    /// 目标状态枚举
    const GOAL_STATUS_ACTIVE: u8 = 0;
    const GOAL_STATUS_COMPLETED: u8 = 1;
    const GOAL_STATUS_FAILED: u8 = 2;

    /// 错误码
    const EInvalidDeadline: u64 = 0;
    const EGoalNotActive: u64 = 1;
    const EDeadlineNotReached: u64 = 2;
    const EEmptyWitnesses: u64 = 3;
    const ENotWitness: u64 = 4;
    const EAlreadyConfirmed: u64 = 5;
    const ENotAllWitnessesConfirmed: u64 = 6;
    const ENotGoalRelatedMember: u64 = 7;
    const EAllWitnessesConfirmed: u64 = 8;
    const ENotGoalCreator: u64 = 9;
    const EAgentIdTooShort: u64 = 10;
    const EAgentNameTooShort: u64 = 11;
    const ECharactorJsonTooShort: u64 = 12;
    const EAgentAlreadyExists: u64 = 13;
    const EAgentNotExists: u64 = 14;
    const EInvalidProgressPercentage: u64 = 15;

    // Const
    const MIN_LENGTH: u64 = 1;
    const AGENT_ID_LENGTH: u64 = 36;
    const CHARACTOR_JSON_MIN_LENGTH: u64 = 20;

    // Airdrop Method
    const AIRDROP_METHOD_CREATE_GOAL: vector<u8> = b"create_goal";
    const AIRDROP_METHOD_CONFIRM_WITNESS: vector<u8> = b"confirm_witness";
    const AIRDROP_METHOD_COMPLETE_GOAL: vector<u8> = b"complete_goal";
    const AIRDROP_METHOD_FAIL_GOAL: vector<u8> = b"fail_goal";
    const AIRDROP_METHOD_CREATE_COMMENT: vector<u8> = b"create_comment";
    const AIRDROP_METHOD_UPDATE_PROGRESS: vector<u8> = b"update_progress";
    const AIRDROP_METHOD_CREATE_AGENT: vector<u8> = b"create_agent";
    const AIRDROP_METHOD_UPDATE_AGENT: vector<u8> = b"update_agent";

    // Airdrop Const
    const AIRDROP_AMOUNT_CREATE_GOAL: u64 = 100_000; // 100 AIG
    const AIRDROP_AMOUNT_CONFIRM_WITNESS: u64 = 50_000; // 50 AIG
    const AIRDROP_AMOUNT_COMPLETE_GOAL: u64 = 100_000; // 100 AIG
    const AIRDROP_AMOUNT_FAIL_GOAL: u64 = 100_000; // 100 AIG
    const AIRDROP_AMOUNT_CREATE_COMMENT: u64 = 10_000; // 100 AIG
    const AIRDROP_AMOUNT_UPDATE_PROGRESS: u64 = 10_000; // 100 AIG
    const AIRDROP_AMOUNT_CREATE_AGENT: u64 = 200_000; // 200 AIG
    const AIRDROP_AMOUNT_UPDATE_AGENT: u64 = 100_000; // 100 AIG

    /// 目标管理器结构体
    public struct GoalManager has key {
        id: UID,
        goals: Table<u64, Goal>,        // 存储所有目标的表格，键为目标ID
        goal_2_agent: Table<u64, String>,  // 存储目标ID与Agent ID的映射
        user_goals: Table<address, vector<u64>>, // 记录用户创建的目标集合
        witness_goals: Table<address, vector<u64>>, // 记录跟见证者相关的目标
        goal_count: u64,                // 目标总数
        active_goals: vector<u64>,      // 活跃目标ID列表
        failed_goals: vector<u64>,      // 失败目标ID列表
        completed_goals: vector<u64>,   // 完成目标ID列表
        balance: Balance<SUI>,          // 质押保证金总额
    }

    /// 目标结构体
    public struct Goal has store {
        id: u64,
        title: String,
        ai_suggestion: String,          // AI建议
        description: String,
        creator: address,
        amount: u64,                    // 保证金数额
        status: u8,                     // 0-进行中、1-已完成、2-失败
        created_at: u64,
        deadline: u64,

        witnesses: vector<address>,      // 见证人地址列表
        confirmations: vector<address>,  // 已确认的见证人列表

        comment_counter: u64,
        comments: Table<u64, Comment>,   // 评论列表

        progress_percentage: u64,        // 进度百分比
        progress_update_counter: u64,
        progress_updates: Table<u64, ProgressUpdate>, // 进度更新列表
    }

    public struct Agent has key, store {
        id: UID,
        agent_id: String,
        agent_name: String,
        charactor_json: String,
    }

    /// 评论结构体
    public struct Comment has store {
        id: u64,
        content: String,        // 评论内容
        creator: address,       // 评论创建者
        created_at: u64,        // 创建时间
    }

    /// 进度更新结构体
    public struct ProgressUpdate has store {
        id: u64,
        content: String,            // 进度内容
        proof_file_blob_id: String, // 证明文件获取地址
        creator: address,           // 更新创建者
        created_at: u64,            // 创建时间
    }

    /// 事件
    public struct EventGoalCreated has copy, drop {
        goal_id: u64,
        creator: address,
        title: String,
        witnesses: vector<address>,
    }

    public struct EventGoalCompleted has copy, drop {
        goal_id: u64,
        completer: address,
    }

    public struct EventWitnessConfirmed has copy, drop {
        goal_id: u64,
        witness: address,
    }

    public struct EventGoalFailed has copy, drop {
        goal_id: u64,
        failer: address,
    }

    public struct CreateAgentEvent has copy, drop, store {
        agent_id: String,
        agent_name: String,
        charactor_json: String,
    }

    public struct UpdateAgentEvent has copy, drop, store {
        agent_id: String,
        charactor_json: String,
    }

    public struct CommentCreatedEvent has copy, drop {
        goal_id: u64,
        comment_id: u64,
        creator: address,
        content: String,
    }

    public struct ProgressUpdateEvent has copy, drop {
        goal_id: u64,
        update_id: u64,
        creator: address,
        content: String,
        progress_percentage: u64,
        proof_file_blob_id: String,
    }

    /// 初始化函数
    fun init(ctx: &mut TxContext) {
        let manager = GoalManager {
            id: object::new(ctx),
            goals: table::new(ctx),
            goal_2_agent: table::new(ctx),
            goal_count: 0,
            user_goals: table::new(ctx),
            witness_goals: table::new(ctx),
            active_goals: vector::empty(),
            failed_goals: vector::empty(),
            completed_goals: vector::empty(),
            balance: balance::zero(),
        };

        transfer::share_object(manager);
    }

    /// 创建新目标
    public entry fun create_goal(
        manager: &mut GoalManager,
        vault: &mut Vault,
        title: vector<u8>,
        description: vector<u8>,
        ai_suggestion: vector<u8>,
        deadline: u64,
        witnesses: vector<address>,
        amount: u64,
        payment_coin: &mut coin::Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let current_time = clock::timestamp_ms(clock);
        assert!(deadline > current_time, EInvalidDeadline);
        assert!(!vector::is_empty(&witnesses), EEmptyWitnesses);

        let goal_id = manager.goal_count;
        let sender = ctx.sender();

        let goal = Goal {
            id: goal_id,
            title: string::utf8(title),
            description: string::utf8(description),
            ai_suggestion: string::utf8(ai_suggestion),
            creator: sender,
            amount,
            deadline,
            status: GOAL_STATUS_ACTIVE,
            created_at: current_time,
            witnesses,
            confirmations: vector::empty(),
            comment_counter: 0,
            comments: table::new(ctx),
            progress_percentage: 0,
            progress_update_counter: 0,
            progress_updates: table::new(ctx),
        };

        let paid = payment_coin.split(amount, ctx);
        coin::put(&mut manager.balance, paid);

        // 更新管理器
        table::add(&mut manager.goals, goal_id, goal);
        vector::push_back(&mut manager.active_goals, goal_id);
        manager.goal_count = manager.goal_count + 1;

        // 记录用户创建的目标集
        let exists  = table::contains(&manager.user_goals, sender);
        if (!exists) {
            table::add(&mut manager.user_goals, sender, vector::empty());
        };

        let user_goal_ids = table::borrow_mut(&mut manager.user_goals, sender);
        vector::push_back(user_goal_ids, goal_id);

        // 记录见证者相关目标
        let witnesses_count = vector::length(&witnesses);
        let mut i = 0_u64;
        while (i < witnesses_count) {
            let witness = witnesses[i];
            let exists = table::contains(&manager.witness_goals, witness);
            if (!exists) {
                table::add(&mut manager.witness_goals, witness, vector::empty());
            };
            let witness_goal_ids = table::borrow_mut(&mut manager.witness_goals, witness);
            vector::push_back(witness_goal_ids, goal_id);
            i = i + 1;
        };

        event::emit(EventGoalCreated {
            goal_id,
            creator: tx_context::sender(ctx),
            title: string::utf8(title),
            witnesses,
        });

        airdrop(vault, AIRDROP_AMOUNT_CREATE_GOAL, AIRDROP_METHOD_CREATE_GOAL, ctx);
    }

    /// 见证人确认目标
    public entry fun confirm_witness(
        manager: &mut GoalManager,
        vault: &mut Vault,
        goal_id: u64,
        ctx: &mut TxContext
    ) {
        let goal = table::borrow_mut(&mut manager.goals, goal_id);
        let sender = ctx.sender();
        assert!(vector::contains(&goal.witnesses, &sender), ENotWitness);
        assert!(!vector::contains(&goal.confirmations, &sender), EAlreadyConfirmed);

        vector::push_back(&mut goal.confirmations, sender);

        event::emit(EventWitnessConfirmed {
            goal_id,
            witness: sender,
        });

        airdrop(vault, AIRDROP_AMOUNT_CONFIRM_WITNESS, AIRDROP_METHOD_CONFIRM_WITNESS, ctx);
    }

    /// 完成目标（需要所有见证人确认）
    public entry fun complete_goal(
        manager: &mut GoalManager,
        vault: &mut Vault,
        goal_id: u64,
        ctx: &mut TxContext
    ) {
        let goal = table::borrow_mut(&mut manager.goals, goal_id);
        assert!(goal.status == GOAL_STATUS_ACTIVE, EGoalNotActive);

        let sender = ctx.sender();
        assert!(goal.creator == sender, ENotGoalCreator);

        // 确保所有见证人都已确认
        let witness_count = vector::length(&goal.witnesses);
        let confirmation_count = vector::length(&goal.confirmations);
        assert!(witness_count == confirmation_count, ENotAllWitnessesConfirmed);

        goal.status = GOAL_STATUS_COMPLETED;

        // 从活跃目标列表中移除
        let (exists, index) = vector::index_of(&manager.active_goals, &goal_id);
        if (exists) {
            vector::remove(&mut manager.active_goals, index);
        };

        // 添加到已完成目标列表
        vector::push_back(&mut manager.completed_goals, goal_id);

        event::emit(EventGoalCompleted {
            goal_id,
            completer: sender,
        });

        goal.progress_percentage = 100;

        // 提取质押金额
        let amount = goal.amount;
        let take_coin = coin::take(&mut manager.balance, amount, ctx);
        transfer::public_transfer(take_coin, sender);

        airdrop(vault, AIRDROP_AMOUNT_COMPLETE_GOAL, AIRDROP_METHOD_COMPLETE_GOAL, ctx);
    }

    /// 标记目标失败
    /// 如果超时，且所有见证者都未确认，则标记为失败，见证者可以平分保证金
    public entry fun fail_goal(
        manager: &mut GoalManager,
        vault: &mut Vault,
        goal_id: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let goal = table::borrow_mut(&mut manager.goals, goal_id);
        assert!(goal.status == GOAL_STATUS_ACTIVE, EGoalNotActive);
        assert!(clock::timestamp_ms(clock) >= goal.deadline, EDeadlineNotReached);

        // 只有目标相关方才能标记任务失败
        let sender = ctx.sender();

        assert!(!vector::contains(&goal.witnesses, &sender) &&
            !vector::contains(&goal.confirmations, &sender) &&
            goal.creator != sender, ENotGoalRelatedMember);

        // 若目标到期，只要有见证者未确认，则目标失败，见证者可以平分保证金
        let witness_count = vector::length(&goal.witnesses);
        let confirmation_count = vector::length(&goal.confirmations);
        assert!(witness_count != confirmation_count, EAllWitnessesConfirmed);

        goal.status = GOAL_STATUS_FAILED;

        // 添加到失败目标列表
        vector::push_back(&mut manager.failed_goals, goal_id);

        // 从活跃目标列表中移除
        let (exists, index) = vector::index_of(&manager.active_goals, &goal_id);
        if (exists) {
            vector::remove(&mut manager.active_goals, index);
        };

        event::emit(EventGoalFailed {
            goal_id,
            failer: sender,
        });

        // 将目标金额转移给见证人
        let amount = goal.amount;
        let per_witness_amount = amount / witness_count;
        let mut i = 0_u64;
        while (i < witness_count) {
            let per_witness_coin = coin::take(&mut manager.balance, per_witness_amount, ctx);
            transfer::public_transfer(per_witness_coin, goal.witnesses[i]);
            i = i + 1;
        };

        airdrop(vault, AIRDROP_AMOUNT_FAIL_GOAL, AIRDROP_METHOD_FAIL_GOAL, ctx);
    }

    public fun create_agent(
        manager: &mut GoalManager,
        vault: &mut Vault,
        goal_id: u64,
        agent_id: String,
        agent_name: String,
        charactor_json: String,
        ctx: &mut TxContext,
    ) {
        assert!(agent_id.length() == AGENT_ID_LENGTH, EAgentIdTooShort);
        assert!(agent_name.length() >= MIN_LENGTH, EAgentNameTooShort);
        assert!(charactor_json.length() >= CHARACTOR_JSON_MIN_LENGTH, ECharactorJsonTooShort);

        // 每个目标只能添加一个Agent
        let exists  = table::contains(&manager.goal_2_agent, goal_id);
        assert!(!exists, EAgentAlreadyExists);
        table::add(&mut manager.goal_2_agent, goal_id, agent_id);

        let id = object::new(ctx);

        let agent = Agent {
            id: id,
            agent_id: agent_id,
            agent_name: agent_name,
            charactor_json: charactor_json,
        };

        event::emit(CreateAgentEvent{
            agent_id: agent_id,
            agent_name: agent_name,
            charactor_json: charactor_json,
        });

        // 添加Agent到动态对象
        dynamic_object_field::add(&mut manager.id, agent_id, agent);

        airdrop(vault, AIRDROP_AMOUNT_CREATE_AGENT, AIRDROP_METHOD_CREATE_AGENT, ctx);
    }

    public fun update_agent(
        manager: &mut GoalManager,
        vault: &mut Vault,
        goal_id: u64,
        charactor_json: String,
        ctx: &mut TxContext,
    ) {
        assert!(charactor_json.length() >= CHARACTOR_JSON_MIN_LENGTH, ECharactorJsonTooShort);

        let agent_id = table::borrow(&manager.goal_2_agent, goal_id);
        assert!(agent_id.length() == AGENT_ID_LENGTH, EAgentNotExists);

        let agent = dynamic_object_field::borrow_mut<String, Agent>(&mut manager.id, *agent_id);

        agent.charactor_json = charactor_json;

        event::emit(UpdateAgentEvent{
            agent_id: *agent_id,
            charactor_json: charactor_json,
        });

        airdrop(vault, AIRDROP_AMOUNT_UPDATE_AGENT, AIRDROP_METHOD_UPDATE_AGENT, ctx);
    }

    /// 创建评论
    public entry fun create_comment(
        manager: &mut GoalManager,
        vault: &mut Vault,
        goal_id: u64,
        content: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // 获取目标
        let goal = table::borrow_mut(&mut manager.goals, goal_id);
        let sender = ctx.sender();
        let current_time = clock::timestamp_ms(clock);

        // 创建评论
        let comment_id = goal.comment_counter;
        let comment = Comment {
            id: comment_id,
            content: string::utf8(content),
            creator: sender,
            created_at: current_time,
        };

        // 添加评论到目标
        table::add(&mut goal.comments, comment_id, comment);
        goal.comment_counter = goal.comment_counter + 1;

        // 发射事件
        event::emit(CommentCreatedEvent {
            goal_id,
            comment_id,
            creator: sender,
            content: string::utf8(content),
        });

        airdrop(vault, AIRDROP_AMOUNT_CREATE_COMMENT, AIRDROP_METHOD_CREATE_COMMENT, ctx);
    }

    /// 更新目标进度
    public entry fun update_progress(
        manager: &mut GoalManager,
        vault: &mut Vault,
        goal_id: u64,
        content: vector<u8>,
        progress_percentage: u64,
        proof_file_blob_id: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // 获取目标
        let goal = table::borrow_mut(&mut manager.goals, goal_id);
        let sender = ctx.sender();
        let current_time = clock::timestamp_ms(clock);

        // 确保只有目标创建者可以更新进度
        assert!(goal.creator == sender, ENotGoalCreator);
        // 确保目标处于活跃状态
        assert!(goal.status == GOAL_STATUS_ACTIVE, EGoalNotActive);
        // 确保进度百分比有效（0-100）
        assert!(progress_percentage > 0 &&
            progress_percentage >= goal.progress_percentage &&
            progress_percentage <= 100, EInvalidProgressPercentage);

        // 创建进度更新
        let update_id = goal.progress_update_counter;
        let update = ProgressUpdate {
            id: update_id,
            content: string::utf8(content),
            proof_file_blob_id: string::utf8(proof_file_blob_id),
            creator: sender,
            created_at: current_time,
        };

        // 更新目标进度
        goal.progress_percentage = progress_percentage;
        table::add(&mut goal.progress_updates, update_id, update);
        goal.progress_update_counter = goal.progress_update_counter + 1;

        // 发射事件
        event::emit(ProgressUpdateEvent {
            goal_id,
            update_id,
            creator: sender,
            content: string::utf8(content),
            progress_percentage,
            proof_file_blob_id: string::utf8(proof_file_blob_id),
        });

        airdrop(vault, AIRDROP_AMOUNT_UPDATE_PROGRESS, AIRDROP_METHOD_UPDATE_PROGRESS, ctx);
    }
}
