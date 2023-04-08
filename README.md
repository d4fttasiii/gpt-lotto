# Lotto Game Smart Contract

A decentralized lottery game built on the Ethereum blockchain using Solidity, OpenZeppelin, and Chainlink VRF for randomness.

## Overview

The Lotto Game Smart Contract allows users to participate in a lottery by purchasing tickets with unique numbers. The contract owner can draw the winning numbers using a secure random number generator provided by Chainlink VRF. The prizes are distributed among the winners based on the number of correct guesses.

## Features

- Secure random number generation using Chainlink VRF
- Users can buy tickets with unique numbers
- Prize distribution based on the number of correct guesses
- Minting of Lotto tokens for each ticket purchase
- Inherits from OpenZeppelin's Ownable contract for secure ownership management

## Functions

### buyTicket(uint256[] memory numbers)

Allows users to buy a ticket by providing 6 unique numbers between 1 and 50. Users must send the exact ticket price as the transaction value. When a user buys a ticket, a Lotto token is minted and transferred to their address.

### drawWinningNumbers()

Can only be called by the contract owner. Initiates the process of drawing the winning numbers using Chainlink VRF. Requires enough LINK tokens in the contract to pay the VRF fee.

### fulfillRandomness(bytes32 requestId, uint256 randomness)

An internal function called by Chainlink VRF when the random number is generated. Generates the winning numbers and calculates the winners' prizes.

### calculatePrize(uint256 correctGuesses)

An internal function that calculates the prize amount based on the number of correct guesses. The function divides the corresponding share of the prize pool by the number of winners for each category, ensuring that each winner gets their fair share.

### getWinnerCount(uint256 correctGuesses)

An internal function that calculates the number of winners for a specific category (e.g., 6 correct guesses, 5 correct guesses, etc.).

## Deployment

To deploy the contract, you'll need to provide the following parameters in the constructor:

- Ticket price (in wei)
- Chainlink VRF coordinator address
- Chainlink LINK token address
- Chainlink VRF key hash
- Chainlink VRF fee
- LottoToken contract address

## Note

Please make sure to thoroughly test the contract before deploying it to the mainnet. The provided code is for educational purposes only and should not be considered production-ready without proper testing and audits.
