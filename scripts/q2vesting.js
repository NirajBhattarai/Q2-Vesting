const hre = require("hardhat");

async function main() {
  const Q2Vesting = await hre.ethers.getContractFactory(
    "Q2Vesting"
  );
  const deployedQ2Vesting = await Q2Vesting.deploy(
    "0xfe54dF9A720bF6B5999096D19B0307B94A924723"
  );

  await deployedQ2Vesting.deployed();

  console.log(
    "Deployed Q2Vesting Address:",
    deployedQ2Vesting.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
