use anchor_lang::prelude::*;

#[program]
pub mod solana_authentication_program {
    use super::*;

    #[state]
    pub struct AuthAccount {
        pub initialized: bool,
        pub authorized: bool,
    }

    impl AuthAccount {
        pub fn new() -> Self {
            Self {
                initialized: false,
                authorized: false,
            }
        }

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

    #[access_control(init_account(&mut ctx))]
    pub fn initialize_account(ctx: Context<InitializeAccount>) -> ProgramResult {
        let account = &mut ctx.accounts.auth_account;
        account.initialize();
        Ok(())
    }

    #[access_control(authenticate_account(&ctx.accounts.auth_account, &ctx.accounts.user_account))]
    pub fn authenticate(ctx: Context<Authenticate>) -> ProgramResult {
        let account = &mut ctx.accounts.auth_account;
        account.authenticate();
        Ok(())
    }

    #[access_control(authenticate_account(&ctx.accounts.auth_account, &ctx.accounts.user_account))]
    pub fn deauthenticate(ctx: Context<Deauthenticate>) -> ProgramResult {
        let account = &mut ctx.accounts.auth_account;
        account.deauthenticate();
        Ok(())
    }
}
