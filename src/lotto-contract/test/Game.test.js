const Game = artifacts.require("Game");
const LottoToken = artifacts.require("LottoToken");
const VRFCoordinatorMock = artifacts.require("MockVRFCordinator");
const { expect } = require("chai");
const { BN, ether } = require("@openzeppelin/test-helpers");

contract("Game", function ([owner, player1, player2]) {
  const ticketPrice = ether("1");
  const fee = ether("0.1");
  const keyHash =
    "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4";

  let game, lottoToken, vrfCoordinatorMock;

  before(async () => {
    const totalSupply = new BN('1000000000000000000000000');
    lottoToken = await LottoToken.new(totalSupply, { from: owner });
    vrfCoordinatorMock = await VRFCoordinatorMock.new(lottoToken.address, { from: owner });
    game = await Game.new(
      ticketPrice,
      lottoToken.address,
      vrfCoordinatorMock.address,
      owner,
      keyHash,
      fee,
      { from: owner }
    );
    await lottoToken.setMinter(game.address, { from: owner });
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
        value: ether("0.5"),
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

  // it("Should draw winning numbers", async () => {
  //   await game.drawWinningNumbers({ from: owner });

  //   // Retrieve requestId from event
  //   const requestId = (await game.getPastEvents("RequestedRandomness"))[0]
  //     .returnValues.requestId;

  //   // Fulfill randomness using VRFCoordinatorMock
  //   await vrfCoordinatorMock.callBackWithRandomness(
  //     requestId,
  //     1234567890111213,
  //     game.address,
  //     { from: owner }
  //   );

  //   const winningNumbers = await game.winningNumbers();
  //   expect(winningNumbers.length).to.equal(6);
  // });

  // it("Should distribute prizes and start a new round", async () => {
  //   await game.distributePrizes({ from: owner });

  //   const newRoundId = await game.roundId();
  //   const newTicketCount = await game.ticketCount();
  //   const newWinningNumbers = await game.winningNumbers();

  //   expect(newRoundId.toString()).to.equal("2");
  //   expect(newTicketCount.toString()).to.equal("0");
  //   expect(newWinningNumbers.length).to.equal(0);
  // });
});
