pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "./interfaces/ILottoToken.sol";

contract Game is VRFConsumerBase, Ownable {
    using SafeMath for uint256;

    ILottoToken token;

    bytes32 private keyHash;
    uint256 private fee;
    uint256 public randomResult;

    uint256 public ticketPrice;
    uint256 public ticketCount;
    uint256[] public winningNumbers;
    mapping(uint256 => address payable) public tickets;
    mapping(uint256 => uint256[]) public ticketNumbers;

    event TicketPurchased(
        address indexed buyer,
        uint256 ticketCount,
        uint256[] numbers
    );
    event WinningNumbers(uint256[] numbers);
    event PrizeClaimed(address indexed winner, uint256 amount);

    constructor(
        uint256 _ticketPrice,
        address _lottoToken,
        address vrfCoordinator,
        address linkToken,
        bytes32 _keyHash,
        uint256 _fee
    ) VRFConsumerBase(vrfCoordinator, linkToken) {
        ticketPrice = _ticketPrice;,
        token = ILottoToken(_lottoToken);
        keyHash = _keyHash;
        fee = _fee;
    }

    function buyTicket(uint256[] memory numbers) public payable {
        require(msg.value == ticketPrice, "Incorrect ticket price.");
        require(
            numbers.length == 6,
            "You must provide exactly 6 unique numbers."
        );

        // Validate the provided numbers
        for (uint256 i = 0; i < numbers.length; i++) {
            require(
                numbers[i] >= 1 && numbers[i] <= 50,
                "Numbers must be between 1 and 50."
            );
            for (uint256 j = i + 1; j < numbers.length; j++) {
                require(numbers[i] != numbers[j], "Numbers must be unique.");
            }
        }

        ticketCount = ticketCount.add(1);
        tickets[ticketCount] = payable(msg.sender);
        ticketNumbers[ticketCount] = numbers;
        emit TicketPurchased(msg.sender, ticketCount, numbers);

         // Mint a token for the user
        lottoToken.mint(msg.sender, 1);
    }

    function drawWinningNumbers() public onlyOwner {
        require(ticketCount > 0, "No tickets have been sold.");
        require(
            winningNumbers.length == 0,
            "Winning numbers have already been drawn."
        );
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK to pay the fee."
        );

        requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(
        bytes32 requestId,
        uint256 randomness
    ) internal override {
        randomResult = randomness;

        // Generate unique winning numbers
        uint256[] memory usedNumbers = new uint256[](50);
        uint256 usedCount = 0;
        uint256 generatedNumbers = 0;
        while (generatedNumbers < 6) {
            uint256 newNumber = (randomResult % 50) + 1;
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
                winningNumbers.push(newNumber);
                generatedNumbers++;
            }
        }
        emit WinningNumbers(winningNumbers);

        // Calculate and distribute prizes
        distributePrizes();
    }

    function distributePrizes() private {
        uint256 prizePool = ticketPrice * ticketCount;
        uint256[] memory winnerTicketIndexes = new uint256[](ticketCount);
        uint256[] memory winnerPrizes = new uint256[](ticketCount);
        uint256 winnerCount = 0;

        // Calculate the winners and their prizes
        for (uint256 i = 1; i <= ticketCount; i++) {
            uint256 correctGuesses = getCorrectGuesses(i);
            uint256 prize = calculatePrize(correctGuesses);

            if (prize > 0 && prize <= prizePool) {
                winnerTicketIndexes[winnerCount] = i;
                winnerPrizes[winnerCount] = prize;
                winnerCount++;
                prizePool -= prize;
            }
        }

        // Send out the prizes to the winners
        for (uint256 i = 0; i < winnerCount; i++) {
            uint256 ticketIndex = winnerTicketIndexes[i];
            uint256 prize = winnerPrizes[i];
            payable(tickets[ticketIndex]).transfer(prize);
            emit PrizeClaimed(tickets[ticketIndex], prize);
        }
    }

    function getCorrectGuesses(
        uint256 ticketNumber
    ) private view returns (uint256) {
        uint256[] memory userNumbers = ticketNumbers[ticketNumber];
        uint256 correctGuesses = 0;

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

    function calculatePrize(
        uint256 correctGuesses
    ) private view returns (uint256) {
        uint256 prizePool = ticketPrice * ticketCount;
        uint256 winnerCount;

        if (correctGuesses == 6) {
            winnerCount = getWinnerCount(6);
            return (prizePool * 50) / 100 / winnerCount; // 50% of the prize pool for 6 correct guesses
        } else if (correctGuesses == 5) {
            winnerCount = getWinnerCount(5);
            return (prizePool * 25) / 100 / winnerCount; // 25% of the prize pool for 5 correct guesses
        } else if (correctGuesses == 4) {
            winnerCount = getWinnerCount(4);
            return (prizePool * 10) / 100 / winnerCount; // 10% of the prize pool for 4 correct guesses
        }

        return 0;
    }

    function getWinnerCount(
        uint256 correctGuesses
    ) private view returns (uint256) {
        uint256 winnerCount = 0;

        for (uint256 i = 1; i <= ticketCount; i++) {
            if (getCorrectGuesses(i) == correctGuesses) {
                winnerCount++;
            }
        }

        return winnerCount;
    }
}
