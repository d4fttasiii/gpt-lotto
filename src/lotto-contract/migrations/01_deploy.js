const LuckyShiba = artifacts.require("./LuckyShiba.sol");
const LuckyShibaToken = artifacts.require("./LuckyShibaToken.sol");
const LuckyShibaReserve = artifacts.require("./LuckyShibaReserve.sol");

module.exports = async (deployer, network, accounts) => {

  await deployer.deploy(LuckyShibaReserve);
  const reserve = await LuckyShibaReserve.deployed();

  const totalSupply = web3.utils.toWei("1000000", "ether");
  await deployer.deploy(LuckyShibaToken, totalSupply, reserve.address);
  const token = await LuckyShibaToken.deployed();

  const ticketPrice = web3.utils.toWei("0.01", "ether");
  const vrfCoordinator = "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255"; // VRF Coordinator address for the network
  const linkToken = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"; // LINK token address for the network
  const keyHash = "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4"; // Public key hash for the network
  const fee = web3.utils.toWei("0.0001", "ether"); // Fee in LINK tokens for the network
  await deployer.deploy(
    LuckyShiba,
    ticketPrice,
    token.address,
    vrfCoordinator,
    linkToken,
    keyHash,
    fee
  );

  console.log(`LuckyShiba: "${LuckyShiba.address}"`);
  console.log(`LuckyShibaToken: "${token.address}"`);
  console.log(`LuckyShibaReserve: "${reserve.address}"`);

  await token.setMinter(LuckyShiba.address);
  await reserve.initializeRequiredSignatures(2);
  await reserve.initializeSigners(["0xb2f0302D8f8aBBdadBB6B5203792d4d3Af1d1f84"]);
};
