pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "./interfaces/ILottoToken.sol";

contract Game is VRFConsumerBase, Ownable {
    using SafeMath for uint256;

    struct Round {
        uint256 roundId;
        uint256 ticketsSold;
        uint8[] winningNumbers;
        uint256 drawnAt;
        uint256 prizePool;
        mapping(uint256 => address[]) winners;
    }

    ILottoToken token;

    bytes32 private keyHash;
    uint256 private fee;

    bytes32 public lastRequestId;
    uint256 public randomResult;

    uint256 public ticketPrice;
    uint256 public ticketCount;
    uint256 public roundId;

    mapping(address => uint256[]) public userTickets;
    mapping(uint256 => address payable) public tickets;
    mapping(uint256 => uint8[]) public ticketNumbers;
    mapping(uint256 => Round) public rounds;

    event TicketPurchased(
        address indexed buyer,
        uint256 ticketCount,
        uint8[] numbers
    );
    event WinningNumbers(uint256 roundId, uint8[] numbers);
    event PrizeClaimed(address indexed winner, uint256 amount);
    event TokenHolderPrizeClaimed(address indexed winner, uint256 amount);

    constructor(
        uint256 _ticketPrice,
        address _lottoToken,
        address _vrfCoordinator,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee
    ) VRFConsumerBase(_vrfCoordinator, _linkToken) {
        ticketPrice = _ticketPrice;
        token = ILottoToken(_lottoToken);
        keyHash = _keyHash;
        fee = _fee;
        roundId = 1;
    }

    // Update the ticket price (only callable by the contract owner)
    function updateTicketPrice(uint256 newTicketPrice) public onlyOwner {
        require(newTicketPrice > 0, "New ticket price must be greater than 0.");
        ticketPrice = newTicketPrice;
    }

    // Buy a ticket with 6 unique numbers, mint a token for the buyer
    function buyTicket(uint8[] memory numbers) public payable {
        require(msg.value == ticketPrice, "Incorrect ticket price.");
        require(
            numbers.length == 6,
            "You must provide exactly 6 unique numbers."
        );

        // Sort the numbers in ascending order
        uint8[] memory sortedNumbers = _sortNumbers(numbers);

        // Validate the provided numbers
        for (uint256 i = 0; i < sortedNumbers.length; i++) {
            require(
                sortedNumbers[i] >= 1 && sortedNumbers[i] <= 50,
                "Numbers must be between 1 and 50."
            );
            if (i < sortedNumbers.length - 1) {
                require(
                    sortedNumbers[i] != sortedNumbers[i + 1],
                    "Numbers must be unique."
                );
            }
        }

        ticketCount = ticketCount.add(1);
        tickets[ticketCount] = payable(msg.sender);
        ticketNumbers[ticketCount] = sortedNumbers;
        userTickets[msg.sender].push(ticketCount);
        emit TicketPurchased(msg.sender, ticketCount, sortedNumbers);

        // Mint a token for the user
        token.mint(msg.sender, 1);
    }

    function getTicketsByAddress(
        address account
    ) public view returns (uint256[] memory) {
        return userTickets[account];
    }

    function getTicketNumbers(
        uint256 ticketNr
    ) public view returns (uint8[] memory) {
        return ticketNumbers[ticketNr];
    }

    function getRoundWinningNumbers(
        uint256 roundNr
    ) public view returns (uint8[] memory) {
        return rounds[roundNr].winningNumbers;
    }

    function getRound(
        uint256 roundNr
    )
        public
        view
        returns (
            uint256 ticketsSold,
            uint256 drawnAt,
            uint256 prizePool,
            uint8[] memory
        )
    {
        return (
            rounds[roundNr].ticketsSold,
            rounds[roundNr].drawnAt,
            rounds[roundNr].prizePool,
            rounds[roundNr].winningNumbers
        );
    }

    function getRoundWinners(
        uint256 roundNr
    )
        public
        view
        returns (
            address[] memory matchOne,
            address[] memory matchTwo,
            address[] memory matchThree,
            address[] memory matchFour,
            address[] memory matchFive,
            address[] memory matchSix
        )
    {
        return (
            rounds[roundNr].winners[1],
            rounds[roundNr].winners[2],
            rounds[roundNr].winners[3],
            rounds[roundNr].winners[4],
            rounds[roundNr].winners[5],
            rounds[roundNr].winners[6]
        );
    }

    // Draw winning numbers using Chainlink VRF
    function drawWinningNumbers() external onlyOwner {
        require(ticketCount > 0, "No tickets have been sold.");
        require(
            rounds[roundId].winningNumbers.length == 0,
            "Winning numbers have already been drawn."
        );
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK to pay the fee."
        );

        lastRequestId = requestRandomness(keyHash, fee);
    }

    // Fulfill randomness from Chainlink VRF and distribute prizes
    function fulfillRandomness(
        bytes32 requestId,
        uint256 randomness
    ) internal override {
        require(lastRequestId == requestId, "Wrong requestId provided!");

        randomResult = randomness;

        // Generate unique winning numbers
        uint8[] memory usedNumbers = new uint8[](50);
        uint256 usedCount = 0;
        uint256 generatedNumbers = 0;
        while (generatedNumbers < 6) {
            uint8 newNumber = uint8((randomResult % 50) + 1);
            randomResult /= 50;

            bool isNumberUsed = false;
            for (uint256 i = 0; i < usedCount; i++) {
                if (usedNumbers[i] == newNumber) {
                    isNumberUsed = true;
                    break;
                }
            }

            if (!isNumberUsed) {
                usedNumbers[usedCount++] = newNumber;
                rounds[roundId].winningNumbers.push(newNumber);
                generatedNumbers++;
            }
        }

        // Sort winning numbers
        rounds[roundId].winningNumbers = _sortNumbers(
            rounds[roundId].winningNumbers
        );
        emit WinningNumbers(roundId, rounds[roundId].winningNumbers);
    }

    function distributePrizes() external onlyOwner {
        require(
            rounds[roundId].winningNumbers.length == 6,
            "Winning numbers have not been drawn yet."
        );
        // Update the winners
        _updateWinners();

        // Calculate and distribute prizes
        _distributePrizes();

        // Start a new round
        _reset();
    }

    // Distribute prizes among the winners
    function _distributePrizes() private {
        // Send 10% of the current contract balance to the contract owner
        uint256 totalPrizePool = address(this).balance;
        uint256 prizePool = totalPrizePool;
        uint256 ownerShare = (prizePool * 10) / 100;
        payable(owner()).transfer(ownerShare);

        // Send out the prizes to the winners
        for (uint8 correctGuesses = 6; correctGuesses >= 1; correctGuesses--) {
            uint256 winnerCount = rounds[roundId]
                .winners[correctGuesses]
                .length;
            if (winnerCount > 0) {
                uint256 prizePerWinner = _calculatePrize(
                    totalPrizePool,
                    correctGuesses
                ) / winnerCount;

                for (uint256 i = 0; i < winnerCount; i++) {
                    address winner = rounds[roundId].winners[correctGuesses][i];
                    payable(winner).transfer(prizePerWinner);
                    emit PrizeClaimed(winner, prizePerWinner);
                }
            }
        }

        // Distribute token holder prizes
        _distributeTokenHolderPrizes(totalPrizePool);

        // Set the round details
        rounds[roundId].ticketsSold = ticketCount;
        rounds[roundId].drawnAt = block.timestamp;
        rounds[roundId].prizePool = totalPrizePool;
    }

    function _updateWinners() private {
        for (uint256 i = 1; i <= ticketCount; i++) {
            uint256 correctGuesses = _getCorrectGuesses(i);
            if (correctGuesses >= 1) {
                rounds[roundId].winners[correctGuesses].push(tickets[i]);
            }
        }
    }

    function _distributeTokenHolderPrizes(uint256 totalPrizePool) private {
        uint256 tokenHolderPrizePool = (totalPrizePool * 5) / 100;
        uint256 totalTokensHeldByPlayers = 0;

        // Calculate the total tokens held by players who participated in the game
        for (uint256 i = 1; i <= ticketCount; i++) {
            address player = tickets[i];
            uint256 playerTokenBalance = token.balanceOf(player);
            totalTokensHeldByPlayers = totalTokensHeldByPlayers.add(
                playerTokenBalance
            );
        }

        // Distribute the token holder prize pool based on the number of tokens held by each player
        for (uint256 i = 1; i <= ticketCount; i++) {
            address player = tickets[i];
            uint256 playerTokenBalance = token.balanceOf(player);
            if (playerTokenBalance > 0) {
                uint256 playerPrize = (tokenHolderPrizePool *
                    playerTokenBalance) / totalTokensHeldByPlayers;
                payable(player).transfer(playerPrize);
                emit TokenHolderPrizeClaimed(player, playerPrize);
            }
        }
    }

    // Get the count of correct guesses for a given ticket
    function _getCorrectGuesses(
        uint256 ticketNumber
    ) private view returns (uint256) {
        uint8[] memory userNumbers = ticketNumbers[ticketNumber];
        uint256 correctGuesses = 0;
        uint8[] memory winningNumbers = rounds[roundId].winningNumbers;

        for (uint256 i = 0; i < userNumbers.length; i++) {
            for (uint256 j = 0; j < winningNumbers.length; j++) {
                if (userNumbers[i] == winningNumbers[j]) {
                    correctGuesses++;
                    break;
                }
            }
        }

        return correctGuesses;
    }

    // Calculate the prize amount based on the number of correct guesses
    function _calculatePrize(
        uint256 prizePool,
        uint256 correctGuesses
    ) private view returns (uint256) {
        uint256 winnerCount;

        if (correctGuesses == 6) {
            winnerCount = _getWinnerCount(6);
            return (prizePool * 40) / 100 / winnerCount; // 40% of the prize pool for 6 correct guesses
        } else if (correctGuesses == 5) {
            winnerCount = _getWinnerCount(5);
            return (prizePool * 25) / 100 / winnerCount; // 20% of the prize pool for 5 correct guesses
        } else if (correctGuesses == 4) {
            winnerCount = _getWinnerCount(4);
            return (prizePool * 10) / 100 / winnerCount; // 10% of the prize pool for 4 correct guesses
        } else if (correctGuesses == 3) {
            winnerCount = _getWinnerCount(3);
            return (prizePool * 5) / 100 / winnerCount; // 5% of the prize pool for 3 correct guesses
        } else if (correctGuesses == 2) {
            winnerCount = _getWinnerCount(2);
            return (prizePool * 3) / 100 / winnerCount; // 3% of the prize pool for 2 correct guesses
        } else if (correctGuesses == 1) {
            winnerCount = _getWinnerCount(1);
            return (prizePool * 2) / 100 / winnerCount; // 2% of the prize pool for 1 correct guesses
        }

        return 0;
    }

    // Get the count of winners for a specific category (e.g., 6 correct guesses, 5 correct guesses, etc.)
    function _getWinnerCount(
        uint256 correctGuesses
    ) private view returns (uint256) {
        uint256 winnerCount = 0;

        for (uint256 i = 1; i <= ticketCount; i++) {
            if (_getCorrectGuesses(i) == correctGuesses) {
                winnerCount++;
            }
        }

        return winnerCount;
    }

    function _reset() private {
        roundId++;
        ticketCount = 0;
    }

    // Sorts an array of numbers in ascending order using Bubble Sort
    function _sortNumbers(
        uint8[] memory numbers
    ) private pure returns (uint8[] memory) {
        for (uint256 i = 0; i < numbers.length - 1; i++) {
            for (uint256 j = 0; j < numbers.length - i - 1; j++) {
                if (numbers[j] > numbers[j + 1]) {
                    uint8 temp = numbers[j];
                    numbers[j] = numbers[j + 1];
                    numbers[j + 1] = temp;
                }
            }
        }
        return numbers;
    }
}
