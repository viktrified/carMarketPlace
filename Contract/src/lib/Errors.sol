// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

library Errors {
    error hasMinted();
    error NotEnoughMintingFee();
    error InsufficientFunds();
    error GreatherThanBalance();
    error DontHaveNFT();
    error HasClaimed();
}
