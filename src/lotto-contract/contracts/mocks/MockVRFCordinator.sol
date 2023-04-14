pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorMock.sol";

contract MockVRFCordinator is VRFCoordinatorMock {
    constructor(address linkAddress) VRFCoordinatorMock(linkAddress) {}
}
