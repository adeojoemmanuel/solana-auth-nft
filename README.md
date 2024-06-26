# ny-sol-dapp-test

This project is generated with the [create-solana-dapp](https://github.com/solana-developers/create-solana-dapp) generator.

## Getting Started

### Prerequisites

- Node v18.18.0 or higher

- Rust v1.77.2 or higher
- Anchor CLI 0.30.0 or higher
- Solana CLI 1.18.9 or higher

### Installation

#### Clone the repo

```shell
git clone <repo-url>
cd <repo-name>
```

#### Install Dependencies

```shell
npm install
```

#### Start the web app

```
npm run dev
```

## Apps

### anchor

This is a Solana program written in Rust using the Anchor framework.

#### Commands

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the command with `npm run`, eg: `npm run anchor`. 

## or follow the easier route like me, incase you have a cargo build-bfs error 😂 
you can make use of the solana playground, i generated a default key for test purposes, and to easily setup without much configuration 

#### Sync the program id:

Running this command will create a new keypair in the `anchor/target/deploy` directory and save the address to the Anchor config file and update the `declare_id!` macro in the `./src/lib.rs` file of the program.

You will manually need to update the constant in `anchor/lib/basic-exports.ts` to match the new program id.

```shell
npm run anchor keys sync
```

#### Build the program:

```shell
npm run anchor-build
```

#### Start the test validator with the program deployed:

```shell
npm run anchor-localnet
```

#### Run the tests

```shell
npm run anchor-test
```

#### Deploy to Devnet

```shell
npm run anchor deploy --provider.cluster devnet
```
### meeting test requirement 

- the solana service is located in ny-nft-app/src/service/sol-service.ts
- the idl.json file is located in ny-nft-app/src/service/idl.json

### web

This is a React app that uses the Anchor generated client to interact with the Solana program.

#### Commands

Start the web app

```shell
npm run dev
```

Build the web app

```shell
npm run build
```



wallet addresses response : 2y3f33wjWNmkHhsYS1KF8d7Ua9drZ99SWz9HB7H6E4E4

Program Id: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA

created account under token: wR8d3NUDcCw1RvUFV9MDaRBPaDYwqgA1CRpw7pXbrCA

- MINT 100 TOKEN TO Recipient -
Token: 2y3f33wjWNmkHhsYS1KF8d7Ua9drZ99SWz9HB7H6E4E4
Recipient: wR8d3NUDcCw1RvUFV9MDaRBPaDYwqgA1CRpw7pXbrCA