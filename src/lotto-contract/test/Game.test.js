const Game = artifacts.require("Game");
const LottoToken = artifacts.require("LottoToken");
const VRFCoordinatorMock = artifacts.require("MockVRFCordinator");
const LinkTokenMock = artifacts.require("MockLinkToken");
const { expect } = require("chai");
const w3 = require("web3");
const web3 = new w3();

contract("Game", function ([owner, player1, player2]) {
  const lottoSupply = web3.utils.toWei("10", 'ether');
  const ticketPrice = web3.utils.toWei("0.1", 'ether');
  const fee = web3.utils.toWei("0.1", 'ether');
  const gameLinkBalance = web3.utils.toWei("10", 'ether');
  const keyHash =
    "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4";

  let game, lottoToken, vrfCoordinatorMock;

  before(async () => {
    const linkToken = await LinkTokenMock.new();
    lottoToken = await LottoToken.new(lottoSupply, { from: owner });
    vrfCoordinatorMock = await VRFCoordinatorMock.new(linkToken.address, { from: owner });
    game = await Game.new(
      ticketPrice,
      lottoToken.address,
      vrfCoordinatorMock.address,
      linkToken.address,
      keyHash,
      fee,
      { from: owner }
    );
    await lottoToken.setMinter(game.address, { from: owner });
    await linkToken.transfer(game.address, gameLinkBalance);
  });

  it("Should buy a ticket", async () => {
    await game.buyTicket([1, 2, 3, 4, 5, 6], { from: player1, value: ticketPrice });
    const userTicket = await game.userTickets(player1, 0);
    expect(userTicket.toString()).to.equal("1");

    const tokenBalance = await lottoToken.balanceOf(player1);
    expect(tokenBalance.toString()).to.equal("1");
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

  it("Should draw winning numbers", async () => {
    // Retrieve requestId from event
    await game.drawWinningNumbers();
    
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
    await game.distributePrizes({ from: owner });

    const newRoundId = await game.roundId();
    const newTicketCount = await game.ticketCount();
    const newWinningNumbers = await game.getRoundWinningNumbers(newRoundId);

    expect(newRoundId.toString()).to.equal("2");
    expect(newTicketCount.toString()).to.equal("0");
    expect(newWinningNumbers.length).to.equal(0);
  });
});
