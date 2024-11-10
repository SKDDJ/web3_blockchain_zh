# Krypt - Web3.0 区块链交易应用

## 项目概述
Krypt是一个基于以太坊的Web3.0应用程序，允许用户使用MetaMask钱包在以太坊网络上进行加密货币转账。该应用提供了一个现代化的用户界面，支持实时交易，并为每笔交易自动生成相关的GIF动画。

## 技术栈
- 前端：React + Vite + TailwindCSS
- 智能合约：Solidity + Hardhat
- Web3集成：ethers.js
- 钱包集成：MetaMask
- API集成：GIPHY API

## 项目结构
项目分为两个主要部分：
1. `client/` - 前端应用
2. `smart_contract/` - 智能合约

### 核心功能
1. 钱包连接

```46:57:client/src/components/Welcome.jsx
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

```104:141:client/src/context/TransactionContext.jsx
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

```30:32:smart_contract/contracts/Transactions.sol
    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }
```


## 环境要求
1. Node.js 环境
2. MetaMask浏览器插件
3. Hardhat开发环境
4. GIPHY API密钥

## 主要组件说明
1. `Welcome.jsx` - 主页面组件，包含钱包连接和转账功能
2. `Transactions.jsx` - 显示交易历史
3. `Services.jsx` - 展示平台服务特性
4. `TransactionContext.jsx` - 处理Web3交互的上下文组件

## 智能合约功能
合约地址存储在：

```3:3:client/src/utils/constants.js
export const contractAddress = "0xfCCF80344a668b72ac4Be23513F0E9E4a35C84fA";
```


主要功能包括：
- 记录交易
- 获取所有交易历史
- 获取交易计数

## 需要本地化的内容
1. 界面文本
2. 错误提示
3. 服务说明
4. 页脚信息

## 运行流程
1. 用户连接MetaMask钱包
2. 输入接收地址、金额和消息
3. 确认交易
4. 交易上链
5. 显示交易历史

## 安全特性
- MetaMask集成确保交易安全
- 智能合约经过验证
- 交易确认机制
- 错误处理和用户提示

这个项目使用了现代区块链应用的典型架构，结合了前端技术和区块链技术，为用户提供了安全、直观的加密货币转账体验。
