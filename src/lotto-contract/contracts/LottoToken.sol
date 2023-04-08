pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ILottoToken.sol";

contract LottoToken is ERC20, Ownable, ILottoToken {
    address private _minter;
    bool private _minterHasBeenSet;

    constructor(uint256 totalSupply) ERC20("LottoToken", "LTN") {
        _setTotalSupply(totalSupply);
    }

    function setMinter(address minter) external onlyOwner {
        require(!_minterHasBeenSet, "LottoToken: minter can only be set once");
        _minter = minter;
        _minterHasBeenSet = true;
    }

    modifier onlyMinter() {
        require(msg.sender == _minter, "LottoToken: caller is not the minter");
        _;
    }

    function mint(address to, uint256 amount) external onlyMinter {
        _mint(to, amount);
    }

    function _setTotalSupply(uint256 newTotalSupply) private {
        uint256 currentTotalSupply = totalSupply();
        require(newTotalSupply >= currentTotalSupply, "LottoToken: new total supply must be greater than or equal to current total supply");

        uint256 difference = newTotalSupply - currentTotalSupply;
        _mint(address(this), difference);
    }
}