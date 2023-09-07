import { ConnectWallet, useContract, useChainId, useSwitchChain } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import "./styles/Home.css";
import { useEffect, useState } from "react";
import { ZKPCompareNumbers } from "./ZKPCompareNumbers";

const contractAddress = "0x0F7aC01dc06335B2A3Fa5A83526b2E7B4616cAa4";
const contractABI = [{"inputs":[{"internalType":"address","name":"verifier","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"uint256","name":"compare","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"numberA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"numberB","type":"uint256"}],"name":"ComparePoker","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_games","outputs":[{"internalType":"uint64","name":"valueA","type":"uint64"},{"internalType":"uint32","name":"flowerA","type":"uint32"},{"internalType":"uint64","name":"valueB","type":"uint64"},{"internalType":"uint32","name":"flowerB","type":"uint32"},{"internalType":"uint64","name":"winner","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_poker_verifier","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_total_supply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[24]","name":"_proof","type":"uint256[24]"},{"internalType":"uint256[3]","name":"_pubSignals","type":"uint256[3]"}],"name":"pokerVerifier","outputs":[],"stateMutability":"nonpayable","type":"function"}];

export default function Home() {

  const chainId = useChainId();
  const switchChain = useSwitchChain();
  const { contract } = useContract( contractAddress, contractABI );

  const strFlowers = [ "梅花", "鑽石", "愛心", "黑桃" ];
  const strNumbers = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ];
  const [ basePoker, setBasePoker ] = useState([ 0, 0 ]);
  const [ winner, setWinner ] = useState("");

  const FisherYatesShuffle = (array) => {

    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  const handleNewGame = () => {
    setBasePoker( ( pre ) => {
      const newRand = [...pre];
      return FisherYatesShuffle( newRand );
    } );
    setWinner("");
  }

  const solidityVerifier = async ( numberA, numberB ) => {
    try {
      const calldata = await ZKPCompareNumbers( numberA, numberB );
      const data = await contract.call("pokerVerifier", [ calldata.BN_proofs, calldata.BN_signals ], 
      {
          gasLimit: 1000000,
      });

      //以下比較好的做法是去看 Transaction Hash
      const winValue = calldata.BN_signals[0].toNumber();

      if( winValue == 1 ){
        setWinner("player 01");
      }else if( winValue == 2 ){
        setWinner("player 02");
      }else{
        setWinner("");
      }

    } catch (error) {
      console.error( error );
    }

  }

  const handleVerify = () => {

    solidityVerifier( basePoker[0], basePoker[1] );
    
  }

  useEffect( () => {
    const pokerBuf = [];
    for( let i = 0 ; i < 52 ; i++ )
    {
      pokerBuf.push( i );
    }
    setBasePoker( FisherYatesShuffle( pokerBuf ) );

  }, [] );

  useEffect( () => {

    //console.log( chainId );
    if( !chainId )
      return;

    if( chainId != Sepolia.chainId )
      switchChain( Sepolia.chainId );

  }, [chainId] );

  return (
    <div>
      <div style={{ textAlign: "center" }}><h1>簡易發牌比大小 with ZK-proof </h1></div>
      <div style={{display: "flex", justifyContent: "center", margin: "4px"}}>
        <div> <ConnectWallet/> </div>
      </div>
      <div style={{fontSize: "20px", textAlign: "center", margin: "4px"}}>
        <a href={`https://sepolia.etherscan.io/address/${contractAddress}`} target="_blank">
          <div>Contract Address</div>
          <div>{contractAddress}</div>
        </a>
      </div>
      <div style={{ textAlign: "center" }}>
        <button style={{ width: "200px", fontSize: "28px", margin: "4px" }} onClick={ handleNewGame }>New Game</button>
        <button style={{ width: "200px", fontSize: "28px", margin: "4px" }} onClick={ handleVerify }>verify proof</button>
      </div>
      <div style={{display: "flex", justifyContent: "center"}}>
        <div style={{ width: "200px", backgroundColor: "#333333", textAlign: "center" }}>
          <h3>Player 01</h3>
          <p>{ strNumbers[ basePoker[0] % strNumbers.length ] }</p>
          <p>{ strFlowers[ Math.floor(basePoker[0] / strNumbers.length) ] }</p>
        </div>
        <div style={{ width: "200px", backgroundColor: "#333333", textAlign: "center" }}>
          <h3>Player 02</h3>
          <p>{ strNumbers[ basePoker[1] % strNumbers.length ] }</p>
          <p>{ strFlowers[ Math.floor(basePoker[1] / strNumbers.length) ] }</p>
        </div>
      </div>
      <div style={ { display: "flex", justifyContent: "center"} }>
        <div style={{ textAlign: "center", margin: "8px", borderColor: "red", borderWidth: "4px", borderStyle: "solid", borderRadius: "16px", width: "300px" }}>
          <h2>Winner</h2>
          <p style={ { backgroundColor: "#444444", fontSize: "20px", padding: "8px"} }>{ winner }</p>
        </div>
      </div>
    </div>
  );
}
