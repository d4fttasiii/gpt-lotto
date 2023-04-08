# Lotto Smart Contract

The Lotto smart contract is a decentralized lottery game that allows users to buy tickets, generates random unique winning numbers using Chainlink VRF, and allows winners to claim their prizes.

## Table of Contents

- [Contract Variables](#contract-variables)
- [Events](#events)
- [Modifiers](#modifiers)
- [Constructor](#constructor)
- [Functions](#functions)
- [Integration](#integration)

## Contract Variables

- `owner`: The owner of the smart contract, usually the contract deployer.
- `ticketPrice`: The price of each lottery ticket.
- `totalTickets`: The total number of lottery tickets available for sale.
- `ticketCount`: The current number of sold lottery tickets.
- `winningNumbers`: An array containing the winning numbers after they have been drawn.
- `tickets`: A mapping of ticket numbers to the addresses that purchased them.
- `keyHash`: The key hash required for Chainlink VRF.
- `fee`: The fee required for using Chainlink VRF.
- `randomResult`: The raw random number result provided by Chainlink VRF.

## Events

- `TicketPurchased`: Emitted when a ticket is purchased, contains the buyer's address and the ticket number.
- `WinningNumbers`: Emitted when the winning numbers are drawn, contains the winning numbers.
- `PrizeClaimed`: Emitted when a prize is claimed, contains the winner's address and the prize amount.

## Modifiers

- `onlyOwner`: Restricts a function to be called only by the contract owner.

## Constructor

The constructor initializes the contract with the ticket price, the total number of tickets, the VRF Coordinator address, the LINK token address, the key hash, and the VRF fee.

## Functions

### buyTicket()

Allows users to buy a lottery ticket by sending the correct ticket price. Emits a `TicketPurchased` event.

### drawWinningNumbers()

Called by the contract owner to request random numbers from Chainlink VRF once all tickets have been sold.

### fulfillRandomness(bytes32 requestId, uint256 randomness)

A callback function for Chainlink VRF that sets the unique winning numbers using the provided random number. Emits a `WinningNumbers` event.

### claimPrize(uint256 ticketNumber)

Allows users to claim their prize if their ticket number matches the winning numbers. Emits a `PrizeClaimed` event.

### calculatePrize(uint256 ticketNumber) private view returns (uint256)

A private function that calculates the prize amount based on the ticket number and the winning numbers. The specific prize calculation logic is not provided in this example and should be implemented based on the desired game rules.

## Integration

To integrate this contract, you will need to deploy it on a supported Ethereum-based network and provide the necessary parameters, such as ticket price, total number of tickets, and Chainlink VRF details. Users can then interact with the contract by purchasing tickets and claiming their prizes, while the owner can draw the winning numbers using Chainlink VRF.
