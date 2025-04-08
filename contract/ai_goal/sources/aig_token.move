module ai_goal::aig_token {
    use std::string::{Self, String};
    use sui::coin::{Self, TreasuryCap}; 
    use sui::balance::{Self, Balance};
    use sui::event;

    public struct EventMint has copy, drop {
        sender: address,
        amount: u64,
        coin_left: u64
    }

    public struct EventAirdrop has copy, drop {
        method: String,
        sender: address,
        amount: u64
    }

    public struct Vault has key {
        id: UID,
        balance: Balance<AIG_TOKEN>,
    }

    public struct AIG_TOKEN has drop {}

    fun init(witness: AIG_TOKEN, ctx: &mut TxContext) {

        let (treasury_cap, metadata) =
            coin::create_currency<AIG_TOKEN>(witness, 3, b"AIG", b"AIG Token", 
            b"AIG Token is a token that is used to incentivize the community to achieve the goals of the AI Goal.", option::none(), ctx);

        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury_cap, ctx.sender());

        transfer::share_object(
            Vault {
                id: object::new(ctx),
                balance: balance::zero(),
            }
        );
    }

    public(package) fun airdrop(vault: &mut Vault, amount: u64, method: vector<u8>, ctx: &mut TxContext) {
        let sender = ctx.sender();

        let mut balance_drop = balance::split(&mut vault.balance, amount);
        let coin_drop = coin::take(&mut balance_drop, amount, ctx);
        transfer::public_transfer(coin_drop, sender);
        balance::destroy_zero(balance_drop);

        event::emit(EventAirdrop{
            method: string::utf8(method),
            sender,
            amount,
        });
    }

    /// Manager can mint new coins
    public fun mint(
        treasury_cap: &mut TreasuryCap<AIG_TOKEN>, vault: &mut Vault, amount: u64, ctx: &mut TxContext
    ) {
        let balance_minted = coin::mint_balance(treasury_cap, amount);
        balance::join(&mut vault.balance, balance_minted);

        event::emit(EventMint {
            sender: ctx.sender(),
            amount: amount,
            coin_left: balance::value(&vault.balance)
        });

    }
}
