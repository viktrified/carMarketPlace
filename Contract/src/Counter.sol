// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract CarContract is Ownable, ERC721SERC721URIStorage {
    constructor() ERC721("CarToken", "CAR") {
        contractOwner = payable(msg.sender);
    }

    uint256 private totalCars;
    uint256 public registrationFee = 0.01 ether;
    address payable public contractOwner;
    mapping(uint256 => Car) public cars;
    mapping(address => uint256[]) public userCars;
    mapping(uint256 => uint256) public carPrices;
    mapping(uint256 => Auction) public carAuctions;

    struct Auction {
        address highestBidder;
        uint256 highestBid;
        uint256 endTime;
        bool active;
    }

    struct Car {
        string name;
        uint registrationTime;
        string color;
        Status status;
        bool upForAution;
        uint numberOfCars;
        address owner;
        address previousOwner;
        uint carPrice;
    }

    enum Status {
        Sold,
        UnSold,
        NotUpForSale
    }

    function registerCar(
        string memory _name,
        string memory _color,
        Status _status,
        bool _upForAuction,
        string memory _tokenURI,
        uint _price
    ) public {
        require(msg.value >= registrationFee, "Insufficient registration fee");

        totalCars++;
        uint256 newItemId = totalCars;

        Car memory newCar = Car({
            name: _name,
            registrationTime: block.timestamp,
            color: _color,
            status: _status,
            upForAuction: _upForAuction,
            owner: msg.sender,
            previousOwner: address(0)
        });

        cars[newItemId] = newCar;
        userCars[msg.sender].push(newItemId);
        carPrices[_carId] = _price;

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        emit CarRegistered(
            msg.sender,
            _name,
            block.timestamp,
            _status,
            _color,
            newItemId
        );
    }

    function removeCar(uint256 _carId) public onlyOwner {
        require(_exists(_carId), "Car does not exist");
        delete cars[_carId];
    }

    function buyCar(uint256 _carId) public payable {
        require(_exists(_carId), "Car does not exist");
        require(carPrices[_carId] > 0, "Car is not for sale");
        require(msg.value >= carPrices[_carId], "Insufficient payment");

        address previousOwner = cars[_carId].owner;
        payable(previousOwner).transfer(msg.value);
        _transfer(previousOwner, msg.sender, _carId);

        cars[_carId].previousOwner = previousOwner;
        cars[_carId].owner = msg.sender;
        cars[_carId].status = Status.Sold;
        carPrices[_carId] = 0;
    }

    function putCarForAuction(uint256 _carId) public {
        require(_exists(_carId), "Car does not exist");
        require(msg.sender == cars[_carId].owner, "Only owner can auction");
        cars[_carId].upForAuction = true;
    }

    function getCarStatus(uint256 _carId) public view returns (Status) {
        require(_exists(_carId), "Car does not exist");
        return cars[_carId].status;
    }

    function withdrawFees() public onlyOwner {
        require(address(this).balance > 0, "No funds to withdraw");
        contractOwner.transfer(address(this).balance);
    }

    function startAuction(uint256 _carId, uint256 _duration) public {
        require(msg.sender == cars[_carId].owner, "Not the car owner");
        carAuctions[_carId] = Auction(
            address(0),
            0,
            block.timestamp + _duration,
            true
        );
    }

    function setRegistrationFee(uint256 _fee) public onlyOwner {
        registrationFee = _fee;
    }

    function bid(uint256 _carId) public payable {
        Auction storage auction = carAuctions[_carId];
        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.value > auction.highestBid, "Bid too low");

        if (auction.highestBid > 0) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;
    }

    function finalizeAuction(uint256 _carId) public {
        Auction storage auction = carAuctions[_carId];
        require(block.timestamp >= auction.endTime, "Auction not ended");
        require(auction.active, "Auction already finalized");

        if (auction.highestBid > 0) {
            payable(cars[_carId].owner).transfer(auction.highestBid);
            _transfer(cars[_carId].owner, auction.highestBidder, _carId);
            cars[_carId].owner = auction.highestBidder;
            cars[_carId].status = Status.Sold;
        }

        auction.active = false;
    }

    function setCarPrice(uint256 _carId, uint256 _price) public {
        require(msg.sender == cars[_carId].owner, "Not the car owner");
        require(_price > 0, "Price must be greater than zero");
        carPrices[_carId] = _price;
    }
}
