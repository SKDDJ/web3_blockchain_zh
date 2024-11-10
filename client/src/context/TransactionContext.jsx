import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useTranslation } from 'react-i18next';

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

// 将 createEthereumContract 移到文件顶部
const createEthereumContract = () => {
  try {
    if (!ethereum) return null;
    
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionsContract;
  } catch (error) {
    console.error("创建合约实例失败:", error);
    return null;
  }
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);
  const { t } = useTranslation();

  const checkIfTransactionsExists = async () => {
    try {
      if (!ethereum) {
        console.log("请安装 MetaMask");
        return;
      }

      const contract = createEthereumContract();
      if (!contract) {
        console.log("合约创建失败");
        return;
      }

      const currentTransactionCount = await contract.getTransactionCount();
      window.localStorage.setItem("transactionCount", currentTransactionCount);
    } catch (error) {
      console.error("检查交易存在时出错:", error);
      // 不要抛出错误，而是优雅地处理它
    }
  };

  const getAllTransactions = async () => {
    try {
      if (!ethereum) return;
      
      const contract = createEthereumContract();
      if (!contract) return;

      const availableTransactions = await contract.getAllTransactions();
      const structuredTransactions = availableTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex) / (10 ** 18)
      }));

      setTransactions(structuredTransactions);
    } catch (error) {
      console.error("获取所有交易时出错:", error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) {
        console.log(t('errors.noMetaMask'));
        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        await getAllTransactions();
      }
    } catch (error) {
      console.error("检查钱包连接时出错:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert(t('errors.noMetaMask'));
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error("连接钱包时出错:", error);
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) {
        alert(t('errors.noMetaMask'));
        return;
      }

      const { addressTo, amount, keyword, message } = formData;
      const contract = createEthereumContract();
      if (!contract) return;

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

      const transactionHash = await contract.addToBlockchain(addressTo, parsedAmount, message, keyword);
      setIsLoading(true);
      await transactionHash.wait();
      setIsLoading(false);

      const transactionsCount = await contract.getTransactionCount();
      setTransactionCount(transactionsCount.toNumber());
    } catch (error) {
      console.error("发送交易时出错:", error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setformData,
        handleChange: (e, name) => {
          setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
        },
        sendTransaction,
        transactions,
        isLoading
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};