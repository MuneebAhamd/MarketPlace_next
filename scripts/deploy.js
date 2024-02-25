// const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await deployer.getBalance();
  // const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  // const marketplace = await Marketplace.deploy();

  // await marketplace.deployed();
  // console.log("marketplaceContractDeployedTo",marketplace.address)

  // const data = {
  //   address: marketplace.address,
  //   abi: JSON.parse(marketplace.interface.format('json'))
  // }

  const Nft = await hre.ethers.getContractFactory("NFTMarketplace");
  const nft=await Nft.deploy();
 
  await nft.deployed();
  console.log("Nft Deployed to",nft.address);

  const data1 = {
    address: nft.address,
    abi: JSON.parse(nft.interface.format('json'))
  }

  //This writes the ABI and address to the mktplace.json
  // fs.writeFileSync('./src/Marketplace.json', JSON.stringify(data))
  fs.writeFileSync('./src/NFT.json',JSON.stringify(data1))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
