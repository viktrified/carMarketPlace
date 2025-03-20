// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./lib/Events.sol";
import "./lib/Errors.sol";

contract CarContract is ERC721URIStorage {
    constructor() ERC721("CarToken", "CAR") {
        contractOwner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "You are not the owner");
        _;
    }

    address payable public immutable contractOwner;
    uint256 public totalCars;
    uint256 public fee = 0.01 ether;
    mapping(uint256 => Car) public cars;
    mapping(address => uint256[]) public userCars;
    mapping(uint256 => Auction) public carAuctions;
    mapping(address => User) public users;

    struct Car {
        address owner;
        address previousOwner;
        string name;
        uint256 registrationTime;
        uint256 carPrice;
        string color;
        string description;
        CarStatus status;
        bool upForAuction;
        uint256 likes;
    }

    enum CarStatus {
        Sold,
        UpForSale,
        NotUpForSale
    }

    struct User {
        address[] followers;
        uint256 totalAuctionParticipatingIn;
        uint256 itemsListed;
        uint256 itemsWon;
        mapping(uint256 => bool) totalLikes;
        Car[] carSold;
    }

    struct Auction {
        address highestBidder;
        address previousBidder;
        uint previousBid;
        uint256 highestBid;
        uint256 endTime;
        bool active;
    }

    function registerCar(
        string memory _name,
        string memory _color,
        string memory _description,
        CarStatus _status,
        string memory _tokenURI,
        uint _price
    ) public payable {
        if (msg.value < fee) revert Errors.InsufficientFee();
        if (bytes(_tokenURI).length == 0) revert Errors.InvalidTokenURI();
        if (_status == CarStatus.Sold) revert Errors.CantRegisterSoldCar();
        if (_price == 0) revert Errors.InvalidPrice();

        totalCars++;
        uint256 newItemId = totalCars;

        Car memory newCar = Car({
            owner: msg.sender,
            previousOwner: address(0),
            name: _name,
            registrationTime: block.timestamp,
            carPrice: _price,
            color: _color,
            description: _description,
            status: _status,
            upForAuction: false,
            likes: 0
        });

        cars[newItemId] = newCar;
        userCars[msg.sender].push(newItemId);

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        emit Events.CarRegistered(
            msg.sender,
            _name,
            block.timestamp,
            _color,
            newItemId
        );
    }

    function buyCar(uint256 _carId) public payable {
        Car storage car = cars[_carId];

        if (car.carPrice <= 0 && car.owner == address(0))
            revert Errors.CarDoesNotExist();
        if (car.status == CarStatus.NotUpForSale) revert Errors.NotForSale();
        if (msg.value < car.carPrice) revert Errors.InsufficientFunds();

        address previousOwner = cars[_carId].owner;

        car.previousOwner = previousOwner;
        car.owner = msg.sender;
        car.status = CarStatus.Sold;
        safeTransferFrom(previousOwner, msg.sender, _carId);

        (bool success, ) = payable(previousOwner).call{value: msg.value}("");
        if (!success) revert Errors.FailedTransaction();

        emit Events.CarSold(previousOwner, msg.sender, msg.value);
    }

    function removeCar(uint256 _carId) public {
        address owner = cars[_carId].owner;

        if (cars[_carId].carPrice <= 0 && cars[_carId].owner == address(0))
            revert Errors.CarDoesNotExist();
        if (msg.sender != owner) revert Errors.NotCarOwner();

        uint256[] storage ownedCars = userCars[owner];
        for (uint256 i = 0; i < ownedCars.length; i++) {
            if (ownedCars[i] == _carId) {
                ownedCars[i] = ownedCars[ownedCars.length - 1];
                ownedCars.pop();
                break;
            }
        }

        delete cars[_carId];
        emit Events.CarRemoved(_carId, owner);
    }

    function putCarForAuction(uint256 _carId, uint _endTime) public payable {
        if (cars[_carId].carPrice <= 0 && cars[_carId].owner == address(0))
            revert Errors.CarDoesNotExist();
        if (msg.sender != cars[_carId].owner) revert Errors.NotCarOwner();
        if (cars[_carId].upForAuction == true)
            revert Errors.AlreadyUpForAuction();
        if (msg.value < fee) revert Errors.InsufficientFee();

        Auction memory auction = Auction({
            highestBidder: address(0),
            previousBidder: address(0),
            previousBid: 0,
            highestBid: 0,
            endTime: _endTime,
            active: true
        });

        cars[_carId].upForAuction = true;
        carAuctions[_carId] = auction;
    }

    function bid(uint256 _carId) public payable {
        Auction storage auction = carAuctions[_carId];

        if (block.timestamp > auction.endTime) revert Errors.AuctionHasEnded();
        if (!auction.active) revert Errors.AuctionNotActive();
        if (auction.highestBidder == address(0)) {
            require(msg.value > cars[_carId].carPrice, "Low Bid Amount");

            auction.highestBidder = msg.sender;
            auction.highestBid = msg.value;
        } else {
            require(
                msg.value > auction.highestBid,
                "Can't bid lower than current bid amount"
            );

            address previousBidder = auction.highestBidder;
            uint256 previousBid = auction.highestBid;

            auction.previousBidder = previousBidder;
            auction.previousBid = previousBid;
            auction.highestBidder = msg.sender;
            auction.highestBid = msg.value;

            (bool success, ) = payable(auction.previousBidder).call{
                value: auction.previousBid
            }("");
            if (!success) revert Errors.FailedTransaction();
            (bool _success, ) = payable(address(this)).call{value: msg.value}(
                ""
            );
            if (!_success) revert Errors.FailedTransaction();

            emit Events.NewBid(_carId, msg.sender, msg.value);
        }
    }

    function finalizeAuction(uint256 _carId) public onlyOwner {
        Auction storage auction = carAuctions[_carId];
        if (block.timestamp <= auction.endTime)
            revert Errors.AuctionHasNotEnded();
        if (!auction.active) revert Errors.AuctionNotActive();
        if (auction.highestBidder == address(0)) revert Errors.NoBidsPlaced();

        auction.active = false;
        address previousOwner = cars[_carId].owner;
        cars[_carId].owner = auction.highestBidder;
        cars[_carId].status = CarStatus.Sold;
        safeTransferFrom(previousOwner, auction.highestBidder, _carId);

        (bool _success, ) = payable(auction.highestBidder).call{
            value: auction.highestBid
        }("");
        if (!_success) revert Errors.FailedTransaction();
    }

    function withdrawFees() public onlyOwner {
        if (address(this).balance <= 0) revert Errors.InsufficientFunds();
        (bool _success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        if (!_success) revert Errors.FailedTransaction();

        emit Events.WithdrawFees();
    }

    function updateCarInfo(
        uint256 _carId,
        string memory _name,
        string memory _color,
        string memory _description,
        uint _price
    ) public onlyOwner {
        if (cars[_carId].carPrice <= 0 && cars[_carId].owner == address(0))
            revert Errors.CarDoesNotExist();
        if (msg.sender == cars[_carId].owner) revert Errors.NotCarOwner();

        Car storage car = cars[_carId];
        car.name = _name;
        car.color = _color;
        car.description = _description;
        car.carPrice = _price;

        emit Events.CarUpdated(_carId, _name, _color, _price);
    }

    function likeCar(uint _carId) public {
        require(
            msg.sender == contractOwner || userCars[msg.sender].length > 0,
            "You must have registered or bought a car before liking"
        );

        users[msg.sender].totalLikes[_carId] = true;
        cars[_carId].likes++;
    }

    function follow() public {
        require(
            msg.sender == contractOwner || userCars[msg.sender].length > 0,
            "You must have registered or bought a car before liking"
        );

        users[msg.sender].followers.push(msg.sender);
    }

    function getCarInfo(
        uint _carId
    ) public view onlyOwner returns (Car memory car_) {
        if (cars[_carId].carPrice <= 0 && cars[_carId].owner == address(0))
            revert Errors.CarDoesNotExist();

        car_ = cars[_carId];
    }

    function getCars() public view onlyOwner returns (Car[] memory cars_) {
        cars_ = new Car[](totalCars);

        for (uint256 i = 1; i <= totalCars; i++) {
            cars_[i - 1] = cars[i];
        }

        cars_;
    }

    function setRegistrationFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }
}

// frontend
// testing
// farming deployment
// integration
// backend deadline
// scripting
// deployment script