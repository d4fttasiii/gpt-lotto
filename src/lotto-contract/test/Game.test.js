const { expect } = require('chai');
const { ethers } = require('hardhat');

contract('Game', () => {
  let Game, game, LottoToken, lottoToken, owner, addr1, addr2;
  let ticketNumbers = [1, 2, 3, 4, 5, 6];

  beforeEach(async () => {
    // Deploy LottoToken
    LottoToken = await ethers.getContractFactory('LottoToken');
    lottoToken = await LottoToken.deploy('LottoToken', 'LT');
    await lottoToken.deployed();

    // Deploy Game with required VRF parameters
    Game = await ethers.getContractFactory('Game');
    game = await Game.deploy(
      ethers.utils.parseEther('1'), // 1 ether ticket price
      lottoToken.address,
      /* VRF parameters here */
    );
    await game.deployed();

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it('should have correct initial state', async () => {
    expect(await game.ticketPrice()).to.equal(ethers.utils.parseEther('1'));
    expect(await game.ticketCount()).to.equal(0);
  });

  it('should allow purchasing a ticket', async () => {
    await game.connect(addr1).buyTicket(ticketNumbers, { value: ethers.utils.parseEther('1') });

    expect(await game.ticketCount()).to.equal(1);
    expect(await game.ticketNumbers(1)).to.deep.equal(ticketNumbers);
  });

  it('should not allow purchasing a ticket with incorrect price', async () => {
    await expect(
      game.connect(addr1).buyTicket(ticketNumbers, { value: ethers.utils.parseEther('0.5') })
    ).to.be.revertedWith('Incorrect ticket price.');
  });

  it('should not allow purchasing a ticket with incorrect number of unique numbers', async () => {
    await expect(
      game.connect(addr1).buyTicket([1, 1, 1, 1, 1, 1], { value: ethers.utils.parseEther('1') })
    ).to.be.revertedWith('Numbers must be unique.');
  });

  // Add more tests here for different scenarios and functionality
});
