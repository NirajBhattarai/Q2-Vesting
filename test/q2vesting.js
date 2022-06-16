const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

let Token;
let hardhatToken;
let Q2Vesting;
let deployedQ2Vesting;
const secondsInDay = 86400;
const currentTimeStampInSecond = (Date.now() / 1000) | 0;

let totalTokenToBeDistributed = (200000000 * 10 ** 18).toLocaleString(
  "fullwide",
  {
    useGrouping: false,
  }
);

describe("Q2Vesting for different investor", function () {
  beforeEach(async () => {
    Token = await ethers.getContractFactory("TestToken");
    hardhatToken = await Token.deploy();
    Q2Vesting = await ethers.getContractFactory("Q2Vesting");
    deployedQ2Vesting = await Q2Vesting.deploy(hardhatToken.address);
  });

  it("Should Not Allow Owner to Add Investor Account if owner account don't have enough allowance", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const unLockTime = currentTimeStampInSecond + 130 * secondsInDay;

    await expect(
      deployedQ2Vesting.addInvestorAccount(
        addr1.address,
        unLockTime,
        totalTokenToBeDistributed
      )
    ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
  });

  it("Should Not Allow Owner to Add Investor Account if owner account don't have sufficient balance ", async function () {
    const tokenToBeDistributed = (1000000000 * 10 ** 18).toLocaleString(
      "fullwide",
      {
        useGrouping: false,
      }
    );
    await hardhatToken.approve(deployedQ2Vesting.address, tokenToBeDistributed);

    const [owner, addr1] = await ethers.getSigners();
    const unLockTime = currentTimeStampInSecond + 130 * secondsInDay;
    await deployedQ2Vesting.addInvestorAccount(
      addr1.address,
      unLockTime,
      tokenToBeDistributed
    );

    await expect(
      deployedQ2Vesting.addInvestorAccount(
        addr1.address,
        unLockTime,
        tokenToBeDistributed
      )
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

  it("Should Allow Owner to Investor Account ", async function () {
    await hardhatToken.approve(
      deployedQ2Vesting.address,
      totalTokenToBeDistributed
    );

    const [owner, addr1] = await ethers.getSigners();
    const unLockTime = currentTimeStampInSecond + 130 * secondsInDay;
    await deployedQ2Vesting.addInvestorAccount(
      addr1.address,
      unLockTime,
      totalTokenToBeDistributed
    );
    const vestingDetails = await deployedQ2Vesting.vestingDetails(
      addr1.address,
      0
    );
    expect(
      Number(vestingDetails[0]).toLocaleString("fullwide", {
        useGrouping: false,
      })
    ).to.equal(totalTokenToBeDistributed);
    expect(Number(vestingDetails[1])).to.equal(unLockTime);
  });

  it("Should Allow Investor Account to Claim Token When Vesting Time Ends ", async function () {
    await hardhatToken.approve(
      deployedQ2Vesting.address,
      totalTokenToBeDistributed
    );

    const [owner, addr1] = await ethers.getSigners();
    const unLockTime = currentTimeStampInSecond + 130 * secondsInDay;
    await deployedQ2Vesting.addInvestorAccount(
      addr1.address,
      unLockTime,
      totalTokenToBeDistributed
    );

    await network.provider.send("evm_increaseTime", [unLockTime]);
    await network.provider.send("evm_mine");

    await deployedQ2Vesting.connect(addr1).unlockQ2(0);
  });

  it("ShouldNot Allow Investor Account to Claim Token When Already Claimed ", async function () {
    await hardhatToken.approve(
      deployedQ2Vesting.address,
      totalTokenToBeDistributed
    );

    const [owner, addr1] = await ethers.getSigners();
    const unLockTime = currentTimeStampInSecond + 130 * secondsInDay;
    await deployedQ2Vesting.addInvestorAccount(
      addr1.address,
      unLockTime,
      totalTokenToBeDistributed
    );

    await network.provider.send("evm_increaseTime", [unLockTime]);
    await network.provider.send("evm_mine");

    await deployedQ2Vesting.connect(addr1).unlockQ2(0);
    await expect(
      deployedQ2Vesting.connect(addr1).unlockQ2(0)
    ).to.be.revertedWith("You do not have permission to unloc");
  });
});
