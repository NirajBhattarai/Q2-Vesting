# Q2 Vesting Contract

## About

The Q2 Vesting contract will lock the Q2 token for a set period of time before distributing it to investors.

## Prerequisites

- Install [Node](https://nodejs.org/)
- Install [Hardhat](https://hardhat.org/getting-started#installation)

## Getting Started

1. Clone the repo locally
2. Install packages with `npm install`

## Run Tests

1. copy and paste the private key into hardhat.config.js
2. Run command `npx hardhat --network ganache test`

## Deployment

1. For the deployment of smart contracts, we need to choose a network, i.e., bscmainnet, etherum, rinkeby or other network.
2. Token Address should be pasted into q2vesting.js in the scripts folder.
3. Run command `npx hardhat run --network networkname scripts/q2vesting.js`
4. To verify contract Run Command `npx hardhat verify --network networkname deployedContractAddress arguments`

## For Example
1. npx hardhat run --network rinkeby scripts/q2Vesting.js
2. npx hardhat verify --network rinkeby deployedAddress `(from step 1)` arguments from `q2vesting.js`
 



