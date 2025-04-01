// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

library Errors {
    error InvalidTokenURI();
    error InsufficientFee();
    error InsufficientFunds();
    error SoldCar();
    error CarDoesNotExist();
    error NotForSale();
    error NotCarOwner();
    error AlreadyUpForAuction();
    error InvalidPrice();
    error LowBidAmount();
    error AuctionHasEnded();
    error GreatherThanBalance();
    error AuctionHasNotEnded();
    error AuctionNotActive();
    error YouCantFollow();
    error FailedTransaction();
    error CantUpdateSoldCar();
    error InvalidAuctionEndTime();
}
