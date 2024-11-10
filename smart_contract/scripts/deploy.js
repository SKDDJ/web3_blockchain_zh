// 添加必要的导入
const hre = require("hardhat");
const { ethers } = require("hardhat");

const main = async () => {
  try {
    // 获取合约工厂
    const Transactions = await ethers.getContractFactory("Transactions");
    console.log("Deploying contract...");
    
    // 部署合约
    const transactions = await Transactions.deploy();
    
    // 等待部署完成
    await transactions.waitForDeployment();
    
    // 获取合约地址
    const address = await transactions.getAddress();
    console.log("Transactions deployed to:", address);
    
    return address;
  } catch (error) {
    console.error("Deployment error:", error);
    throw error;
  }
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();