const Game = artifacts.require("./Game.sol");
const LottoToken = artifacts.require("./LottoToken.sol");

module.exports = async (deployer, network, accounts) => {

  const totalSupply = web3.utils.toWei("1000000", "ether");
  await deployer.deploy(LottoToken, totalSupply);
  const lottoToken = await LottoToken.deployed();

  const ticketPrice = web3.utils.toWei("0.01", "ether");
  const vrfCoordinator = "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed"; // VRF Coordinator address for the network
  const linkToken = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"; // LINK token address for the network
  const keyHash = "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f"; // Public key hash for the network
  const fee = web3.utils.toWei("0.0005", "ether"); // Fee in LINK tokens for the network
  await deployer.deploy(
    Game,
    ticketPrice,
    LottoToken.address,
    vrfCoordinator,
    linkToken,
    keyHash,
    fee
  );

  await lottoToken.setMinter(Game.address);

  console.log(`Game: "${Game.address}",`);
  console.log(`LottoToken: "${LottoToken.address}"`);
};
