const { expect } = require("chai");
const { BN, ether } = require("@openzeppelin/test-helpers");
const w3 = require("web3");
const web3 = new w3();

const LuckyShibaToken = artifacts.require("LuckyShibaToken");
const LuckyShibaReserve = artifacts.require("LuckyShibaReserve");

contract("LuckyShibaReserve", (accounts) => {

  const totalSupply = web3.utils.toWei("1000000", "ether");
  const [owner, signer1, signer2, receiver] = accounts;
  let luckyShibaReserve, luckyShibaToken;

  beforeEach(async () => {
    luckyShibaReserve = await LuckyShibaReserve.new();
    luckyShibaToken = await LuckyShibaToken.new(totalSupply, luckyShibaReserve.address);
  });

  describe("initializeSigners", () => {
    it("should add initial signers", async () => {
      await luckyShibaReserve.initializeSigners([signer1, signer2], {
        from: owner,
      });

      const isSigner1 = await luckyShibaReserve.signers(signer1);
      const isSigner2 = await luckyShibaReserve.signers(signer2);

      expect(isSigner1).to.be.true;
      expect(isSigner2).to.be.true;
    });
  });

  describe("initializeRequiredSignatures", () => {
    it("should set required signatures", async () => {
      const requiredSignatures = 2;

      await luckyShibaReserve.initializeRequiredSignatures(requiredSignatures, {
        from: owner,
      });

      const result = await luckyShibaReserve._requiredSignatures();

      expect(result.toString()).to.equal("2");
    });
  });

  describe("createTransfer", () => {
    beforeEach(async () => {
      await luckyShibaReserve.initializeSigners([signer1, signer2], {
        from: owner,
      });
      await luckyShibaReserve.initializeRequiredSignatures(2, {
        from: owner,
      });
    });

    it("should create a new transfer", async () => {
      const amount = ether("1");
      const transferTx = await luckyShibaReserve.createTransfer(luckyShibaToken.address, receiver, amount, {
        from: signer1,
      });

      const transferId = transferTx.logs[0].args.transferId;
      const { to, amount: transferAmount } = await luckyShibaReserve.transfers(transferId);

      expect(to).to.equal(receiver);
      expect(transferAmount).to.be.bignumber.equal(amount);
    });
  });

  describe("approveTransfer", () => {

    beforeEach(async () => {
      await luckyShibaReserve.initializeSigners([signer1, signer2], {
        from: owner,
      });
      await luckyShibaReserve.initializeRequiredSignatures(2, {
        from: owner,
      });

      amount = ether("1");
      const transferTx = await luckyShibaReserve.createTransfer(luckyShibaToken.address, receiver, amount, {
        from: signer1,
      });
      transferId = transferTx.logs[0].args.transferId;
    });

    it("should approve the transfer and execute it", async () => {
      const initialBalance = await luckyShibaToken.balanceOf(receiver);

      await luckyShibaReserve.approveTransfer(transferId, {
        from: signer2,
      });

      const finalBalance = await luckyShibaToken.balanceOf(receiver);
      expect(finalBalance.sub(initialBalance)).to.be.bignumber.equal(amount);
    });

    it("should not approve the transfer if signer has already signed", async () => {
      try {
        await luckyShibaReserve.approveTransfer(transferId, {
          from: signer1,
        });
        assert.fail("The transaction should have thrown an error");
      } catch (err) {
        expect(err.reason).to.equal("Caller has already signed");
      }
    });
  });
});
