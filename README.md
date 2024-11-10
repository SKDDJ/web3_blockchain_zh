# Krypt - Web3.0 区块链交易应用
> Krypt是一个基于以太坊的Web3.0应用程序，允许用户使用MetaMask钱包在以太坊网络上进行加密货币转账。该应用提供了一个现代化的用户界面，支持实时交易，并为每笔交易自动生成相关的GIF动画。

### 0. 在线演示
可以通过以下链接访问项目的在线演示版本：
https://shiym.top/web3_blockchain_zh/

注意：此演示版本部署在 GitHub Pages 上，仅用于展示界面功能。如需进行实际的区块链交易，请按照说明文档在本地部署完整版本。

### 技术栈
- 前端：React + Vite + TailwindCSS
- 智能合约：Solidity + Hardhat
- Web3集成：ethers.js
- 钱包集成：MetaMask
- API集成：GIPHY API

### 项目结构
项目分为两个主要部分：
1. `client/` - 前端应用
2. `smart_contract/` - 智能合约

### 1. 安装依赖

首先需要在项目的两个主要目录中安装依赖：

```bash
# 安装前端依赖
cd client
npm install

# 安装智能合约依赖
cd ../smart_contract
npm install
```

### 2. 环境配置

1. 在 `smart_contract` 目录创建 `.env` 文件：
```bash
ALCHEMY_API_KEY=你的_Alchemy_API_密钥
PRIVATE_KEY=你的以太坊钱包私钥
```

2. 在 `client` 目录创建 `.env` 文件：
```bash
VITE_GIPHY_API=你的_GIPHY_API_密钥
```


### 3. 部署智能合约

在 `smart_contract` 目录下执行：

```bash
# 编译合约
npx hardhat compile

# 启动本地测试网络（终端 1）
npx hardhat node

# 新开终端部署到本地测试网络（终端 2）
npx hardhat run scripts/deploy.js --network localhost
```

部署成功后，你将看到类似输出：
```bash
Deploying contract...
Transactions deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

#### 本地测试网络账户
启动本地节点后，Hardhat 会创建 20 个测试账户，每个都有 10000 ETH：

```bash
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
...
```

⚠️ **警告**：这些账户和私钥是公开的，仅用于本地测试。永远不要在主网或其他生产环境中使用它们！

#### 部署详情说明
当合约部署成功时，你可以看到以下信息：
```bash
Contract deployment: Transactions
Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3
Transaction:         0xfb0aac8b91a397891628347e5357e75cdb9827cee8ef7d67f2edc83f71ab3d64
From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
Value:               0 ETH
Gas used:           498309 of 30000000
Block #1:           0xd86548db...
```

这些信息的含义：
- `Contract address`: 部署后的合约地址，需要更新到前端配置中
- `Transaction`: 部署交易的哈希值
- `From`: 部署合约的账户地址（默认使用第一个测试账户）
- `Gas used`: 部署消耗的 gas 数量
- `Block #1`: 包含部署交易的区块哈希

### 4. 更新合约地址

将部署得到的合约地址更新到前端配置：

```javascript:client/src/utils/constants.js
// 替换为你的实际部署地址
export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
```

### 补充说明

1. **MetaMask 配置**
   - 网络名称：Hardhat
   - RPC URL：http://127.0.0.1:8545
   - Chain ID：31337
   - 货币符号：ETH

2. **测试账户导入**
   - 可以将任意测试账户的私钥导入 MetaMask 进行测试
   - 建议使用 Account #0 作为部署账户
   - 其他账户可用于测试转账功能

3. **常见问题**
   - 如果端口 8545 被占用，使用 `lsof -i :8545` 找出并关闭占用进程
   - 部署失败时，先确保本地节点正在运行
   - 清理缓存：`npx hardhat clean` 后重新编译部署

### 5. 运行前端应用

在 `client` 目录下执行：

```bash
# 开发模式运行
npm run dev

# 或构建生产版本
npm run build
npm run serve
```

### 完整的命令顺序：

```bash
# 1. 克隆项目后，安装依赖
cd client
npm install
cd ../smart_contract
npm install

# 2. 配置环境变量（创建并编辑 .env 文件）

# 3. 部署智能合约
cd smart_contract
npx hardhat compile
npx hardhat node  # 终端 1
npx hardhat run scripts/deploy.js --network localhost  # 终端 2

# 4. 运行前端
cd ../client
npm run dev
```

### 核心功能
1. 钱包连接

```javascript
{!currentAccount && (
  <button
    type="button"
    onClick={connectWallet}
    className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
  >
    <AiFillPlayCircle className="text-white mr-2" />
    <p className="text-white text-base font-semibold">
      Connect Wallet
    </p>
  </button>
)}
```

2. 加密货币转账

```javascript
const sendTransaction = async () => {
  try {
    if (ethereum) {
      const { addressTo, amount, keyword, message } = formData;
      const transactionsContract = createEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: "0x5208",
          value: parsedAmount._hex,
        }],
      });

      const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);
      setIsLoading(false);

      const transactionsCount = await transactionsContract.getTransactionCount();

      setTransactionCount(transactionsCount.toNumber());
      window.location.reload();
    } else {
      console.log("No ethereum object");
    }
  } catch (error) {
    console.log(error);
    throw new Error("No ethereum object");
  }
};
```

3. 交易历史记录

```solidity
function getAllTransactions() public view returns (TransferStruct[] memory) {
    return transactions;
}
```
### 环境要求
1. Node.js 环境
2. MetaMask浏览器插件
3. Hardhat开发环境
4. GIPHY API密钥

### 主要组件说明
1. `Welcome.jsx` - 主页面组件，包含钱包连接和转账功能
2. `Transactions.jsx` - 显示交易历史
3. `Services.jsx` - 展示平台服务特性
4. `TransactionContext.jsx` - 处理Web3交互的上下文组件

### 常见问题处理
- 端口 8545 被占用：使用 `lsof -i :8545` 找出并关闭占用进程
- 部署失败：确保本地节点正在运行
- 清理缓存：使用 `npx hardhat clean` 后重新编译部署

### 注意事项：

1. 确保已安装 MetaMask 浏览器插件
2. 需要有测试网络的 ETH（如果部署到测试网）
3. 运行前确保所有环境变量都已正确配置
4. 本地开发时，MetaMask 需要连接到 Hardhat 的本地网络（默认端口 8545）
5. 确保 Node.js 版本兼容（建议使用 v14 或更高版本）

### 访问应用：

前端应用默认运行在：
- 开发模式：http://localhost:5173
- 生产模式：http://localhost:4173

### 如何联系作者
- 邮箱：yimingshi666@gmail.com
- 微信：sym17358605372