import { ethers } from "hardhat";

async function main() {

  const Stamp = await ethers.getContractFactory("Stamp");
  const stamp = await Stamp.deploy();

  await stamp.deployed();

  console.log("Blaze passport deployed to:", stamp.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
