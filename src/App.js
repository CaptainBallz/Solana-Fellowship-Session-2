import React, { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey, LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import "./App.css";

function App() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [balance, setBalance] = useState(null);
  const [delegateAddressValue, setDelegateAddressValue] = useState("");

  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    const walletBalance = await connection.getBalance(publicKey);
    setBalance(walletBalance / LAMPORTS_PER_SOL);
  }, [publicKey, connection]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const mintToken = async () => {
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }
    try {
      const mintTransaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: publicKey,
          lamports: 100000000,
          space: 0,
          programId: SystemProgram.programId,
        })
      );

      const signature = await sendTransaction(mintTransaction, connection);
      await connection.confirmTransaction(signature, "processed");

      alert("Minting successful!");
      fetchBalance();
    } catch (error) {
      console.error("Minting failed", error);
    }
  };

  const burnToken = async () => {
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }
    try {
      const burnTransaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey,
          lamports: 500000000,
        })
      );

      const signature = await sendTransaction(burnTransaction, connection);
      await connection.confirmTransaction(signature, "processed");

      alert("Burning successful!");
      fetchBalance();
    } catch (error) {
      console.error("Burning failed", error);
    }
  };

  const delegateStake = async () => {
    if (!publicKey) {
      alert("Please connect your wallet!");
      return;
    }
    if(delegateAddressValue.trim() === ''){
      alert("Please enter the delegate address")
      return
    }
    if(delegateAddressValue.length < 32 || delegateAddressValue.length > 44){
      alert("Please enter a valid delegate address")
      return
      
    }
    try {
      const delegateTransaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(delegateAddressValue),
          lamports: 100000000,
        })
      );

      const signature = await sendTransaction(delegateTransaction, connection);
      await connection.confirmTransaction(signature, "processed");

      alert("Delegation successful!");
      fetchBalance();
    } catch (error) {
      console.error("Delegation failed", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Solana Phantom Wallet Integration</h1>
        <WalletMultiButton />
        {publicKey && (
          <div>
            <p>Public Key: {publicKey.toBase58()}</p>
            <p>Balance: {balance !== null ? `${balance} SOL` : "Loading..."}</p>
            <button className="mint-btn" onClick={mintToken}>Mint Token</button>
            <button className="burn-btn" onClick={burnToken}>Burn Token</button>
            <div>
            <input className="delegate-add-inp" placeholder="Delegate Address" value={delegateAddressValue} onChange={(e)=> setDelegateAddressValue(e.target.value)} />
            <button className="delegate-add-btn" onClick={delegateStake}>Delegate Stake</button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
