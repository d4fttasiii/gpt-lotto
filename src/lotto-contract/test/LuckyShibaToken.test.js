// test/LuckyShibaToken.test.js
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const LuckyShibaToken = artifacts.require('LuckyShibaToken');

contract('LuckyShibaToken', function (accounts) {
  const [owner, minter, receiver, other] = accounts;

  const maxSupply = new BN('1000000000000000000000000'); // 1,000,000 tokens with 18 decimals
  const reserveSupply = maxSupply.divn(10).muln(7); // 70% of the total supply

  beforeEach(async function () {
    this.token = await LuckyShibaToken.new(maxSupply, owner, { from: owner });
  });

  it('should have the correct total supply', async function () {
    expect(await this.token.totalSupply()).to.be.bignumber.equal(reserveSupply);
  });

  it('should have minted 70% of the total supply to the initialTokenHolder', async function () {
    expect(await this.token.balanceOf(owner)).to.be.bignumber.equal(reserveSupply);
  });

  it('should allow the owner to set the minter', async function () {
    await this.token.setMinter(minter, { from: owner });
    const storedMinter = await this.token.minter();
    expect(storedMinter).to.equal(minter);
  });

  it('should prevent non-owners from setting the minter', async function () {
    await expectRevert(
      this.token.setMinter(minter, { from: other }),
      'Ownable: caller is not the owner',
    );
  });

  it('should prevent setting the minter more than once', async function () {
    await this.token.setMinter(minter, { from: owner });
    await expectRevert(
      this.token.setMinter(other, { from: owner }),
      'LuckyShibaToken: minter can only be set once',
    );
  });

  it('should allow the minter to mint tokens', async function () {
    await this.token.setMinter(minter, { from: owner });
    const mintAmount = new BN('1000000000000000000'); // 1 token with 18 decimals

    const receipt = await this.token.mint(receiver, mintAmount, { from: minter });
    expectEvent(receipt, 'Transfer', { from: '0x0000000000000000000000000000000000000000', to: receiver, value: mintAmount });

    expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal(mintAmount);
    expect(await this.token.totalSupply()).to.be.bignumber.equal(reserveSupply.add(mintAmount));
  });

  it('should prevent non-minters from minting tokens', async function () {
    await this.token.setMinter(minter, { from: owner });
    const mintAmount = new BN('1000000000000000000'); // 1 token with 18 decimals

    await expectRevert(
      this.token.mint(receiver, mintAmount, { from: other }),
      'LuckyShibaToken: caller is not the minter',
    );
  });
});
