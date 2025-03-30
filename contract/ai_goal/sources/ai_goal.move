module ai_goal::ai_goal {
    use std::string::{Self, String};
    use sui::clock::{Self, Clock};
    use sui::sui::SUI;
    use sui::event;
    use sui::table::{Self, Table};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::dynamic_object_field::{ Self };

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

    /// 目标管理器结构体
    public struct GoalManager has key {
        id: UID,
        goals: Table<u64, Goal>, // 存储所有目标的表格，键为目标ID
        user_goals: Table<address, vector<u64>>, // 记录用户创建的目标集合
        witness_goals: Table<address, vector<u64>>, // 记录跟见证者相关的目标
        goal_count: u64, // 目标总数
        active_goals: vector<u64>, // 活跃目标ID列表
        failed_goals: vector<u64>, // 失败目标ID列表
        completed_goals: vector<u64>, // 完成目标ID列表
        balance: Balance<SUI>, // 质押保证金总额
    }

    /// 目标结构体
    public struct Goal has store {
        id: u64,
        title: String,
        ai_suggestion: String, // AI建议
        description: String,
        creator: address,
        amount: u64, // 保证金数额
        status: u8, // 0-进行中、1-已完成、2-失败
        created_at: u64,
        deadline: u64,

        witnesses: vector<address>, // 见证人地址列表
        confirmations: vector<address>, // 已确认的见证人列表

        comment_counter: u64,
        comments: Table<u64, Comment>, // 评论列表

        progress_percentage: u64, // 进度百分比
        progress_update_counter: u64,
        progress_updates: Table<u64, ProgressUpdate>, // 进度更新列表
    }

    /// 评论结构体
    public struct Comment has store {
        id: u64,
        content: String, // 评论内容
        creator: address, // 评论创建者
        created_at: u64, // 创建时间
    }

    /// 进度更新结构体
    public struct ProgressUpdate has store {
        id: u64,
        content: String, // 进度内容
        creator: address, // 更新创建者
        created_at: u64, // 创建时间
        proof_image_url: String, // 证明图片链接
    }

    public struct BotPool has key, store {
        id: UID,
        bot_id: String,
        name: String,
        symbol: String,
        ca: String,
        bot_json: String,
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

    public struct CreateBotEvent has copy, drop, store {
        bot_id: String,
        name: String,
        symbol: String,
        description: String,
        url: String,
        ca: String,
        bot_json: String,
    }

    public struct UpdateBotEvent has copy, drop, store {
        bot_id: String,
        name: String,
        symbol: String,
        ca: String,
        old_bot_json: String,
        new_bot_json: String,
        sender: address,
    }

    /// 初始化函数
    fun init(ctx: &mut TxContext) {
        let manager = GoalManager {
            id: object::new(ctx),
            goals: table::new(ctx),
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
        assert!(
            deadline > current_time,
            EInvalidDeadline
        );
        assert!(
            !vector::is_empty(&witnesses),
            EEmptyWitnesses
        );

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
        let exists = table::contains(&mut manager.user_goals, sender);
        if (!exists) {
            table::add(
                &mut manager.user_goals,
                sender,
                vector::empty()
            );
        };

        let mut user_goal_ids = table::borrow_mut(&mut manager.user_goals, sender);
        vector::push_back(user_goal_ids, goal_id);

        // 记录见证者相关目标
        let witnesses_count = vector::length(&witnesses);
        let mut i = 0_u64;
        while (i < witnesses_count) {
            let witness = witnesses[i];
            let exists = table::contains(&mut manager.witness_goals, witness);
            if (!exists) {
                table::add(
                    &mut manager.witness_goals,
                    witness,
                    vector::empty()
                );
            };
            let witness_goal_ids = table::borrow_mut(&mut manager.witness_goals, witness);
            vector::push_back(witness_goal_ids, goal_id);
            i = i + 1;
        };

        event::emit(
            EventGoalCreated {
                goal_id,
                creator: tx_context::sender(ctx),
                title: string::utf8(title),
                witnesses,
            }
        );
    }
}
