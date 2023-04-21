// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ILottoToken.sol";

contract LuckyShibaToken is ERC20, Ownable, ILottoToken {
    address public minter;
    bool private _minterHasBeenSet;
    uint256 public maximumSupply;

    constructor(
        uint256 totalSupply,
        address initialTokenHolder
    ) ERC20("LuckyShibaToken", "LST") {
        maximumSupply = totalSupply;

        // Calculate 70% of the total supply
        uint256 initialSupply = (totalSupply / 10) * 7;

        // Mint 70% of the total supply and send it to the initialTokenHolder
        _mint(initialTokenHolder, initialSupply);
    }

    function setMinter(address _minter) external onlyOwner {
        require(
            !_minterHasBeenSet,
            "LuckyShibaToken: minter can only be set once"
        );
        minter = _minter;
        _minterHasBeenSet = true;
    }

    modifier onlyMinter() {
        require(
            msg.sender == minter,
            "LuckyShibaToken: caller is not the minter"
        );
        _;
    }

    function mint(address to, uint256 amount) external onlyMinter {
        if (maximumSupply >= amount + totalSupply()) {
            _mint(to, amount);
        }
    }
}
