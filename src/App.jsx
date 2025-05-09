import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const contractAddress = "0x365FAc31C393dCE2369b9b0e30D540b758dB7D95"; // Replace
const abi = [
  "function deposit() public payable",
  "function getBalance() public view returns (uint)",
  "function balances(address) public view returns (uint)",
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const Web3provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await Web3provider.send("eth_requestAccounts", []);
      const signer2 = await Web3provider.getSigner(); // Or: provider.getSigner();
      const address = await signer2.getAddress();
      const contract = new ethers.Contract(contractAddress, abi, signer2);

      setProvider(Web3provider);
      setAccount(address);
      setSigner(signer2);
      setContract(contract);
      setAccount(address);
      console.log("Wallet connected:", address);
    } catch (err) {
      console.error("Error connecting wallet:", err);
      alert("Failed to connect wallet. Check console for details.");
    }
  } else {
    alert("MetaMask not detected. Please install MetaMask.");
  }
};


  const deposit = async () => {
    if (!contract) return alert("Please connect your wallet first!");
    const tx = await contract.deposit({ value: ethers.parseEther("0.0001") });
    await tx.wait();
    alert("Deposit successful!");
  };

  const fetchBalance = async () => {
    if (!contract) return;
    const bal = await contract.getBalance();
    setBalance(ethers.formatEther(bal));
  };

  return (
    <div className="App">
      <h1>Payable DApp</h1>

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Connected as: {account}</p>
      )}

      <button onClick={deposit}>Deposit 0.0001 ETH</button>
      <button onClick={fetchBalance}>Get Contract Balance</button>
      <p>Contract Balance: {balance} ETH</p>
    </div>
  );
}

export default App;
