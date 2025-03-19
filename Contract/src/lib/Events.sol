// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

library Events {
    event CarRegistered(
        address owner,
        string name,
        uint registrationTime,
        string color,
        uint carId
    );
    event CarSold(address seller, address buyer, uint amount);
    event CarRemoved(uint carId, address owner);
    event NewBid(uint carId, address newBidder, uint bidAmount);
    event WithdrawFees();
    event CarUpdated(uint carId, string name, string color, uint price);
}
