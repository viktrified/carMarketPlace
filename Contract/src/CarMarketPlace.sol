// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

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
    mapping(uint256 => Auction) public auctions;
    mapping(address => User) public users;

    event CarUpdated(
        uint carId,
        string name,
        CarStatus status,
        bool upForAuction,
        uint price
    );

    struct Auction {
        address highestBidder;
        address previousBidder;
        uint previousBid;
        uint256 highestBid;
        uint256 endTime;
        bool active;
    }

    struct Car {
        address owner;
        address previousOwner;
        uint previousCarPrice;
        string name;
        uint256 registrationTime;
        uint256 carPrice;
        string color;
        string description;
        CarStatus status;
        bool upForAuction;
    }

    enum CarStatus {
        Sold,
        UpForSale,
        NotUpForSale
    }

    struct User {
        address[] followers;
        uint[] cars;
        uint256 totalAuctionParticipatingIn;
        uint256[] itemsListedInAuction;
        uint256[] itemsWonInAuction;
        uint totalCarsSold;
    }

    function follow(address _user) public {
        if (
            users[msg.sender].cars.length > 1 ||
            users[msg.sender].totalAuctionParticipatingIn > 1
        ) revert Errors.YouCantFollow();

        users[_user].followers.push(msg.sender);
    }

    function finalizeAuction(uint256 _carId) public onlyOwner {
        Auction storage auction = auctions[_carId];
        if (block.timestamp <= auction.endTime)
            revert Errors.AuctionHasNotEnded();
        if (!auction.active) revert Errors.AuctionNotActive();

        users[auction.highestBidder].itemsWonInAuction.push(_carId);
        users[cars[_carId].owner].totalCarsSold++;
        address previousOwner = cars[_carId].owner;
        cars[_carId].owner = auction.highestBidder;
        cars[_carId].status = CarStatus.Sold;
        safeTransferFrom(previousOwner, auction.highestBidder, _carId);
        auction.active = false;

        (bool _success, ) = payable(auction.highestBidder).call{
            value: auction.highestBid
        }("");
        if (!_success) revert Errors.FailedTransaction();
    }

    function bid(uint256 _carId) public payable {
        Auction storage auction = auctions[_carId];

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

            users[msg.sender].totalAuctionParticipatingIn++;

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

    function putCarForAuction(uint256 _carId, uint _endTime) public payable {
        if (cars[_carId].carPrice <= 0 && cars[_carId].owner == address(0))
            revert Errors.CarDoesNotExist();
        if (_endTime <= block.timestamp) revert Errors.InvalidAuctionEndTime();
        if (msg.sender != cars[_carId].owner) revert Errors.NotCarOwner();
        if (cars[_carId].upForAuction == true)
            revert Errors.AlreadyUpForAuction();
        if (msg.value < fee) revert Errors.InsufficientFee();
        if (cars[_carId].status != CarStatus.UpForSale)
            revert Errors.NotForSale();

        Auction memory auction = Auction({
            highestBidder: address(0),
            previousBidder: address(0),
            previousBid: 0,
            highestBid: 0,
            endTime: _endTime,
            active: true
        });

        cars[_carId].upForAuction = true;
        users[msg.sender].itemsListedInAuction.push(_carId);
        auctions[_carId] = auction;

        emit Events.AuctionCreated(msg.sender, _carId, _endTime);
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
        if (_status == CarStatus.Sold) revert Errors.SoldCar();
        if (_price == 0) revert Errors.InvalidPrice();

        totalCars++;
        uint256 newItemId = totalCars;

        Car memory newCar = Car({
            owner: msg.sender,
            previousOwner: address(0),
            previousCarPrice: 0,
            name: _name,
            registrationTime: block.timestamp,
            carPrice: _price,
            color: _color,
            description: _description,
            status: _status,
            upForAuction: false
        });

        cars[newItemId] = newCar;
        users[msg.sender].cars.push(newItemId);

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
        if (car.status == CarStatus.Sold) revert Errors.SoldCar();

        address previousOwner = cars[_carId].owner;

        car.previousOwner = previousOwner;
        car.owner = msg.sender;

        for (uint256 i = 0; i < users[previousOwner].cars.length; i++) {
            if (users[previousOwner].cars[i] == _carId) {
                users[previousOwner].cars[i] = users[previousOwner].cars[
                    users[previousOwner].cars.length - 1
                ];
                users[previousOwner].cars.pop();
                break;
            }
        }

        car.previousCarPrice = car.carPrice;
        car.carPrice = msg.value;
        car.status = CarStatus.Sold;
        users[msg.sender].totalCarsSold++;
        safeTransferFrom(previousOwner, msg.sender, _carId);

        (bool success, ) = payable(previousOwner).call{value: msg.value}("");
        if (!success) revert Errors.FailedTransaction();

        emit Events.CarSold(previousOwner, msg.sender, msg.value);
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
        string memory _description,
        uint _price,
        CarStatus _status,
        bool _upForAuction
    ) public {
        if (cars[_carId].carPrice <= 0 && cars[_carId].owner == address(0))
            revert Errors.CarDoesNotExist();
        if (msg.sender == cars[_carId].owner) revert Errors.NotCarOwner();
        if (_status == CarStatus.Sold) revert Errors.CantUpdateSoldCar();

        Car storage car = cars[_carId];
        car.name = _name;
        car.description = _description;
        car.carPrice = _price;
        car.status = _status;
        car.upForAuction = _upForAuction;

        emit CarUpdated(_carId, _name, _status, _upForAuction, _price);
    }

    function getCarInfo(
        uint _carId
    ) public view onlyOwner returns (Car memory car_) {
        if (cars[_carId].carPrice <= 0 && cars[_carId].owner == address(0))
            revert Errors.CarDoesNotExist();

        car_ = cars[_carId];
    }

    function getUsersCars(
        address _user
    ) public view onlyOwner returns (uint256[] memory cars_) {
        cars_ = users[_user].cars;
    }

    function getCars() public view onlyOwner returns (Car[] memory cars_) {
        cars_ = new Car[](totalCars);

        for (uint256 i = 1; i <= totalCars; i++) {
            cars_[i - 1] = cars[i];
        }

        cars_;
    }

    function setFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }
}
