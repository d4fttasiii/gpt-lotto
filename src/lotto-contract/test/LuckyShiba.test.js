const LuckyShiba = artifacts.require("LuckyShiba");
const LuckyShibaToken = artifacts.require("LuckyShibaToken");
const VRFCoordinatorMock = artifacts.require("MockVRFCordinator");
const LinkTokenMock = artifacts.require("MockLinkToken");
const { expect } = require("chai");
const w3 = require("web3");
const web3 = new w3();

contract("Game", function ([owner, application, player1, player2]) {
  const totalSupply = web3.utils.toWei("10", 'ether');
  const ticketPrice = web3.utils.toWei("0.1", 'ether');
  const fee = web3.utils.toWei("0.1", 'ether');
  const gameLinkBalance = web3.utils.toWei("10", 'ether');
  const keyHash =
    "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4";

  let game, luckyShibaToken, vrfCoordinatorMock;

  before(async () => {
    const linkToken = await LinkTokenMock.new();
    luckyShibaToken = await LuckyShibaToken.new(totalSupply, owner, { from: owner });
    vrfCoordinatorMock = await VRFCoordinatorMock.new(linkToken.address, { from: owner });
    game = await LuckyShiba.new(
      ticketPrice,
      luckyShibaToken.address,
      application,
      vrfCoordinatorMock.address,
      linkToken.address,
      keyHash,
      fee,
      { from: owner }
    );
    await luckyShibaToken.setMinter(game.address, { from: owner });
    await linkToken.transfer(game.address, gameLinkBalance);
  });

  it("Should buy a ticket", async () => {
    await game.buyTicket([1, 2, 3, 4, 5, 6], { from: player1, value: ticketPrice });
    const userTicketNrs = await game.getTicketsByAddress(player1);
    expect(userTicketNrs[0].toString()).to.equal("1");

    const tokenBalance = await luckyShibaToken.balanceOf(player1);
    expect(tokenBalance.toString()).to.equal(web3.utils.toWei("1", 'ether').toString());
  });

  it("Should fail when buying a ticket with incorrect price", async () => {
    try {
      await game.buyTicket([1, 2, 3, 4, 5, 6], {
        from: player1,
        value: "50000",
      });
      assert.fail("Expected revert not received");
    } catch (error) {
      expect(error.message).to.include("Incorrect ticket price.");
    }
  });

  it("Should fail when buying a ticket with invalid numbers", async () => {
    try {
      await game.buyTicket([1, 1, 3, 4, 5, 6], {
        from: player1,
        value: ticketPrice,
      });
      assert.fail("Expected revert not received");
    } catch (error) {
      expect(error.message).to.include("Numbers must be unique.");
    }
  });

  it("Should draw winning numbers and block ticket purchases during the process", async () => {
    // Retrieve requestId from event
    await game.drawWinningNumbers({ from : application});

    try {
      await game.buyTicket([1, 2, 3, 4, 5, 6], {
        from: player1,
        value: ticketPrice,
      });
      assert.fail("Expected revert not received");
    } catch (error) {
      expect(error.message).to.include("Round is not in progress");
    }

    // Getting the last request id
    const requestId = await game.lastRequestId();

    // Fulfill randomness using VRFCoordinatorMock
    await vrfCoordinatorMock.callBackWithRandomness(
      requestId,
      123456789,
      game.address,
      { from: owner }
    );

    const round = await game.roundId();
    const winningNumbers = await game.getRoundWinningNumbers(round);
    expect(winningNumbers.length).to.equal(6);
  });

  it("Should distribute prizes and start a new round", async () => {
    await game.distributePrizes({ from: application });

    const newRoundId = await game.roundId();
    const newTicketCount = await game.getTicketCount();
    const newWinningNumbers = await game.getRoundWinningNumbers(newRoundId);
    const tickets = await game.getTicketsByAddress(player1);

    expect(newRoundId.toString()).to.equal("2");
    expect(newTicketCount.toString()).to.equal("0");
    expect(newWinningNumbers.length).to.equal(0);
    expect(tickets.length).to.equal(0);
  });

  it("Should have correct round values after playing two rounds", async () => {
    await game.buyTicket([31, 32, 33, 34, 35, 36], { from: player1, value: ticketPrice });

    // Retrieve requestId from event
    await game.drawWinningNumbers({ from: application });

    // Getting the last request id
    const requestId = await game.lastRequestId();

    // Fulfill randomness using VRFCoordinatorMock
    await vrfCoordinatorMock.callBackWithRandomness(
      requestId,
      123456789,
      game.address,
      { from: owner }
    );

    await game.distributePrizes({ from: application });

    await game.buyTicket([31, 32, 33, 34, 35, 36], { from: player1, value: ticketPrice });
    await game.buyTicket([1, 2, 3, 4, 5, 6], { from: player2, value: ticketPrice });

    // Check round values
    const newRoundId = await game.roundId();
    expect(newRoundId.toString()).to.equal("3");

    const round = await game.getRound(newRoundId);
    expect(round.ticketCount.toString()).to.equal("2");
    expect(round.drawnAt.toString()).to.equal("0");
    expect(round[3].length).to.equal(0);

    const tickets = await game.getTicketsByAddress(player1);
    expect(tickets.length).to.equal(1);
    expect(tickets[0].toString()).to.equal("1");

    const numbers = await game.getTicketNumbers(tickets[0]);
    expect(numbers.length).to.equal(6);
    expect(numbers[0].toString()).to.equal("31");
  });

});
