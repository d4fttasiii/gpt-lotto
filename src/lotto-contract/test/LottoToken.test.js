// test/LottoToken.test.js
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const LottoToken = artifacts.require('LottoToken');

contract('LottoToken', function (accounts) {
  const [owner, minter, receiver, other] = accounts;

  const totalSupply = new BN('1000000000000000000000000'); // 1,000,000 tokens with 18 decimals

  beforeEach(async function () {
    this.token = await LottoToken.new(totalSupply, { from: owner });
  });

  it('should have the correct total supply', async function () {
    expect(await this.token.totalSupply()).to.be.bignumber.equal(totalSupply);
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
      'LottoToken: minter can only be set once',
    );
  });

  it('should allow the minter to mint tokens', async function () {
    await this.token.setMinter(minter, { from: owner });
    const mintAmount = new BN('1000000000000000000'); // 1 token with 18 decimals

    const receipt = await this.token.mint(receiver, mintAmount, { from: minter });
    expectEvent(receipt, 'Transfer', { from: '0x0000000000000000000000000000000000000000', to: receiver, value: mintAmount });

    expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal(mintAmount);
    expect(await this.token.totalSupply()).to.be.bignumber.equal(totalSupply.add(mintAmount));
  });

  it('should prevent non-minters from minting tokens', async function () {
    await this.token.setMinter(minter, { from: owner });
    const mintAmount = new BN('1000000000000000000'); // 1 token with 18 decimals

    await expectRevert(
      this.token.mint(receiver, mintAmount, { from: other }),
      'LottoToken: caller is not the minter',
    );
  });
});
