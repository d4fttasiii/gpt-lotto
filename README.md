# Game Smart Contract

The Game smart contract is a decentralized lottery game built on Ethereum using Solidity. It incorporates OpenZeppelin and Chainlink VRF libraries to ensure a secure and fair gameplay experience.

## Features
- Buy lottery tickets with unique 6-number combinations
- Utilize Chainlink VRF for drawing random winning numbers
- Automated prize distribution based on the number of correct guesses
- Token holder rewards
- Configurable ticket pricing
- Owner-controlled game rounds

## Prize Distribution
The prize distribution in the Game smart contract allocates different portions of the total prize pool to winners based on their number of correct guesses. The breakdown is as follows:

- 6 correct guesses: 50% of the prize pool
- 5 correct guesses: 25% of the prize pool
- 4 correct guesses: 10% of the prize pool

Additionally:

- Contract owner: 10% of the prize pool
- Token holder rewards: 5% of the prize pool

The token holder distribution is calculated based on the proportion of tokens held by each participating player relative to the total tokens held by all players who participated in the game.

## How to Use
1. Deploy the smart contract on the Ethereum network
2. Configure the ticket price and provide the addresses for the LottoToken, VRF Coordinator, and LINK Token
3. Users can buy tickets by providing 6 unique numbers and paying the ticket price in Ether
4. The contract owner initiates the draw for winning numbers using Chainlink VRF
5. The contract owner distributes the prizes based on the number of correct guesses and token holder rewards

## Smart Contract Functions
The smart contract includes the following main functions:
- `buyTicket(uint8[] memory numbers)`: Buy a ticket with 6 unique numbers
- `drawWinningNumbers()`: Draw winning numbers using Chainlink VRF
- `distributePrizes()`: Distribute prizes among winners and token holders
- `updateTicketPrice(uint256 newTicketPrice)`: Update the ticket price (only callable by the contract owner)

## Security
The smart contract uses SafeMath for arithmetic operations and implements the Ownable pattern to ensure that only the contract owner can perform specific actions. Chainlink VRF is used to ensure true randomness when drawing winning numbers.
