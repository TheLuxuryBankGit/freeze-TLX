import { useEffect, useState } from "react";
import { ethers, Contract, providers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import TxList from "./TxList";
import MainToken from './MainToken.json'
import Web3Modal from 'web3modal'


export default function App() {
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [txs, setTxs] = useState([]);
  const [userAccount, setUserAccount] = useState()
  const [amount, setAmount] = useState()


  const handleSubmit = async (e) => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)   
    const network =  await provider.getNetwork();
    
    if (isNaN(amount) || userAccount === undefined || amount === undefined)
    {
      setError("please input exact address and price");
      return;
    }

    console.log(amount);
    console.log(userAccount);
    // return;

    if (network.chainId != 56){
      setError("please change the network to bsc testnet");
      return;
    }

    var releaseDate = new Date();
    console.log(releaseDate.getTime())
    releaseDate.setMonth(releaseDate.getMonth() + 6);
    // releaseDate.setSeconds(releaseDate.getSeconds() + 5);
    // releaseDate.setUTCSeconds(releaseDate.getUTCSeconds() - 5);

    const signer = provider.getSigner()
    const address = await signer.getAddress()

    const mainContract = new ethers.Contract('0xea255909e46a54d54255219468991c69ca0e659d', MainToken.abi, signer)

    // const balance  = await mainContract.balanceOf(address);

    // console.log(balance.toString())
    const price = ethers.utils.parseUnits(amount, 'ether')

    console.log(releaseDate.getTime())
    // const transation = await mainContract.freezeTo(userAccount.toString(), price, releaseDate.getTime());
    // const transation = await mainContract.transfer(userAccount.toString(), price);
    try {
      const transation = await mainContract.freezeTo(userAccount, price, releaseDate.getTime());
      setError();
      setSuccess("Sucessfully sended.")
    } catch (error) {
      console.log(error);
      setError("invalid address");
    }
  };

  return (
    <form className="m-4" >
      <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            Send ETH payment
          </h1>
          <div className="">
            <div className="my-3">
              <input
                type="text"
                name="addr"
                className="input input-bordered block w-full focus:ring focus:outline-none"
                placeholder="Recipient Address"
                onChange={e => setUserAccount(e.target.value)}
              />
            </div>
            <div className="my-3">
              <input
                name="ether"
                type="number"
                className="input input-bordered block w-full focus:ring focus:outline-none"
                placeholder="Amount in ETH"
                onChange={e => setAmount(e.target.value)}
              />
            </div>
          </div>
        </main>
        <footer className="p-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
          >
            Pay now
          </button>
          <ErrorMessage message={error} />
          <SuccessMessage message={success} />
          <TxList txs={txs} />
        </footer>
      </div>
    </form>
  );
}
