# SOLANA ESCROW

A peer-to-peer real-world assets marketplace where strangers can trade without middlemen. This project is a re implementation of [halffin](https://github.com/palsp/halffin) on Solana blockchain. For learning purpose, We omit the implementation of chainlink oracle and replace it with mocks program call instead.

## Prerequisites

Please install or have installed the following:

- [Rust](https://www.rust-lang.org/tools/install)

- [Solana](https://docs.solana.com/cli/install-solana-cli-tools)

- [Anchor](https://project-serum.github.io/anchor/getting-started/installation.html#install-anchor)

- [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

## RUNNING IN LOCALNET

1. start solana local validator

```sh
solana-test-validator
```

2. test the program. this step will build, deploy and run the test.

```sh
anchor test
```

to skip the test. run the following instead.

```sh
anchor build
anchor deploy
```

3. start the frontend

```sh
yarn start:client
```
