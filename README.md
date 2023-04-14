# Game Smart Contract

This Solidity smart contract is a lottery game that uses Chainlink VRF to randomly select the winning numbers. Users can buy tickets with unique numbers, and prizes are distributed based on the number of correct guesses.

## Features
- Buy lottery tickets with unique 6-number combinations
- Utilize Chainlink VRF for drawing random winning numbers
- Automated prize distribution based on the number of correct guesses
- Token holder rewards
- Configurable ticket pricing
- Owner-controlled game rounds

## Security
The smart contract uses SafeMath for arithmetic operations and implements the Ownable pattern to ensure that only the contract owner can perform specific actions. Chainlink VRF is used to ensure true randomness when drawing winning numbers.

## Prize Distribution
The prize distribution in the Game smart contract allocates different portions of the total prize pool to winners based on their number of correct guesses. The breakdown is as follows:

- 40% of the prize pool for 6 correct guesses
- 25% of the prize pool for 5 correct guesses
- 10% of the prize pool for 4 correct guesses
- 5% of the prize pool for 3 correct guesses
- 3% of the prize pool for 2 correct guesses
- 2% of the prize pool for 1 correct guess

Additionally:

- Contract owner: 10% of the prize pool
- Token holder rewards: 5% of the prize pool

The token holder distribution is calculated based on the proportion of tokens held by each participating player relative to the total tokens held by all players who participated in the game.

## Smart Contract Functions
- updateTicketPrice(uint256 newTicketPrice): Updates the ticket price. Can only be called by the contract owner.
- buyTicket(uint8[] memory numbers): Buys a ticket with 6 unique numbers and mints a token for the buyer.
- getTicketsByAddress(address account): Returns the ticket numbers associated with a specific address.
- getTicketNumbers(uint256 ticketNr): Returns the numbers associated with a specific ticket number.
- getRound(uint256 roundNr): Returns the details of a specific round.
- getRoundWinners(uint256 roundNr): Returns the winners for each category of a specific round.
- drawWinningNumbers(): Draws the winning numbers using Chainlink VRF. Can only be called by the contract owner.
- distributePrizes(): Distributes prizes among winners and token holders. Can only be called by the contract owner.

## Events
- TicketPurchased(address indexed buyer, uint256 ticketCount, uint8[] numbers): Emitted when a ticket is purchased.
- WinningNumbers(uint256 roundId, uint8[] numbers): Emitted when winning numbers are drawn for a round.
- PrizeClaimed(address indexed winner, uint256 amount): Emitted when a prize is claimed by a winner.
- TokenHolderPrizeClaimed(address indexed winner, uint256 amount): Emitted when a token holder claims their share of the prize pool.

## How to Use
1. Deploy the smart contract on the Ethereum network
2. Configure the ticket price and provide the addresses for the LottoToken, VRF Coordinator, and LINK Token
3. Users can buy tickets by providing 6 unique numbers and paying the ticket price in Ether
4. The contract owner initiates the draw for winning numbers using Chainlink VRF
5. The contract owner distributes the prizes based on the number of correct guesses and token holder rewards
