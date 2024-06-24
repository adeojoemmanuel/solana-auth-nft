use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("EvrVb8xTURBJJi41ogioxxi64p3YaZmDTPpN3M6CXi7G");

#[program]
pub mod solana_authentication_program {
    use super::*;

    pub fn initialize_account(ctx: Context<InitializeAccount>) -> Result<()> {
        let account = &mut ctx.accounts.auth_account;
        account.initialize();
        Ok(())
    }

    pub fn authenticate(ctx: Context<Authenticate>) -> Result<()> {
        let account = &mut ctx.accounts.auth_account;
        account.authenticate();
        Ok(())
    }

    pub fn deauthenticate(ctx: Context<Deauthenticate>) -> Result<()> {
        let account = &mut ctx.accounts.auth_account;
        account.deauthenticate();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeAccount<'info> {
    #[account(init, payer = user, space = 8 + 2)]
    pub auth_account: Account<'info, AuthAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Authenticate<'info> {
    #[account(mut)]
    pub auth_account: Account<'info, AuthAccount>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Deauthenticate<'info> {
    #[account(mut)]
    pub auth_account: Account<'info, AuthAccount>,
    pub user: Signer<'info>,
}

#[account]
pub struct AuthAccount {
    pub initialized: bool,
    pub authorized: bool,
}

impl AuthAccount {
    pub fn initialize(&mut self) {
        self.initialized = true;
    }

    pub fn authenticate(&mut self) {
        self.authorized = true;
    }

    pub fn deauthenticate(&mut self) {
        self.authorized = false;
    }
}
