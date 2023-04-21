// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LuckyShibaReserve is Ownable {
    uint8 public _requiredSignatures;
    bool private _signersInitialized;
    bool private _requiredSignaturesInitialized;

    struct Transfer {
        address token;
        address to;
        uint256 amount;
        uint256 createdAt;
        address[] signers;
    }

    mapping(address => bool) public signers;
    mapping(bytes32 => Transfer) public transfers;
    mapping(bytes32 => bool) public executedTransfers;

    event SignerAdded(address signer);
    event SignerRemoved(address signer);
    event RequiredSignaturesChanged(uint8 requiredSignatures);
    event TransferCreated(
        bytes32 indexed transferId,
        address to,
        uint256 amount
    );
    event TransferSigned(bytes32 indexed transferId, address signer);
    event TransferExecuted(
        bytes32 indexed transferId,
        address to,
        uint256 amount,
        uint256 executeAt
    );

    modifier onlySigner() {
        require(signers[msg.sender], "Not a signer");
        _;
    }

    constructor() {
        // Setting owner as the first signer
        signers[msg.sender] = true;
    }

    function initializeSigners(
        address[] calldata initialSigners
    ) external onlyOwner {
        require(!_signersInitialized, "Signers already initialized");
        for (uint256 i = 0; i < initialSigners.length; i++) {
            signers[initialSigners[i]] = true;
            emit SignerAdded(initialSigners[i]);
        }
    }

    function initializeRequiredSignatures(
        uint8 requiredSignatures
    ) external onlyOwner {
        require(
            !_requiredSignaturesInitialized,
            "Required signatures already initialized"
        );
        _requiredSignatures = requiredSignatures;
        emit RequiredSignaturesChanged(requiredSignatures);
    }

    function removeSigner(address signer) external onlyOwner {
        signers[signer] = false;
        emit SignerRemoved(signer);
    }

    function createTransfer(
        address token,
        address to,
        uint256 amount
    ) external onlySigner returns (bytes32) {
        uint256 contractBalance = IERC20(token).balanceOf(address(this));
        require(contractBalance >= amount, "Insufficient contract balance");
        
        uint256 createdAt = block.timestamp;
        bytes32 transferId = getTransferId(token, to, amount, createdAt);

        transfers[transferId].token = token;
        transfers[transferId].to = to;
        transfers[transferId].amount = amount;
        transfers[transferId].createdAt = createdAt;
        transfers[transferId].signers.push(msg.sender);

        emit TransferCreated(transferId, to, amount);

        return transferId;
    }

    function approveTransfer(bytes32 transferId) external onlySigner {
        require(!executedTransfers[transferId], "Transfer already executed");
        require(
            !hasSignedAlready(transferId, msg.sender),
            "Caller has already signed"
        );

        transfers[transferId].signers.push(msg.sender);
        emit TransferSigned(transferId, msg.sender);

        if (transfers[transferId].signers.length >= _requiredSignatures) {
            IERC20 token = IERC20(transfers[transferId].token);
            token.transfer(
                transfers[transferId].to,
                transfers[transferId].amount
            );
            executedTransfers[transferId] = true;
            emit TransferExecuted(
                transferId,
                transfers[transferId].to,
                transfers[transferId].amount,
                block.timestamp
            );
        }
    }

    function getTransferDetails(
        bytes32 transferId
    )
        public
        view
        returns (
            address txToken,
            address txTo,
            uint256 txAmount,
            uint256 txCreatedAt,
            address[] memory txSigners
        )
    {
        return (
            transfers[transferId].token,
            transfers[transferId].to,
            transfers[transferId].amount,
            transfers[transferId].createdAt,
            transfers[transferId].signers
        );
    }

    function getTransferId(
        address token,
        address to,
        uint256 amount,
        uint256 timestamp
    ) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(token, to, amount, timestamp));
    }

    function hasSignedAlready(
        bytes32 transferId,
        address signer
    ) public view returns (bool) {
        address[] memory currentSigners = transfers[transferId].signers;
        for (uint256 i = 0; i < currentSigners.length; i++) {
            if (currentSigners[i] == signer) {
                return true;
            }
        }

        return false;
    }
}
