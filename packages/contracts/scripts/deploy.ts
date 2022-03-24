import hre, { ethers } from "hardhat";

async function main() {

  const Stamp = await ethers.getContractFactory("Stamp");
  const stamp = await Stamp.deploy();

  await stamp.deployed();

  console.log("Blaze passport deployed to:", stamp.address);
  await hre.run("verify:verify", {
    contract: stamp.address,
  });
  console.log("Blaze passport verified!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
