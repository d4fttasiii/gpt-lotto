// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

contract MockLinkToken is ERC20 {
    address public minter;
    bool private _minterHasBeenSet;

    constructor() ERC20("Chainlink", "LINK") {
        _mint(msg.sender, 100 ether);
    }

    function transferAndCall(
        address to,
        uint256 value,
        bytes calldata data
    ) external returns (bool success) {
        transfer(to, value);
    }
}
