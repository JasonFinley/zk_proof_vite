import { ConnectWallet } from "@thirdweb-dev/react";
import "./styles/Home.css";
import { useEffect, useState } from "react";
import { ZKPCompareNumbers } from "./ZKPCompareNumbers";

export default function Home() {

  const strFlowers = [ "梅花", "鑽石", "愛心", "黑桃" ];
  const strNumbers = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" ];
  const [ basePoker, setBasePoker ] = useState([ 0, 0 ]);

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
  }

  const handleVerify = () => {

    ZKPCompareNumbers( basePoker[0], basePoker[1] ).then( ( res ) => {
      console.log( "calldata : ", res );
    } );

    // let v0 = basePoker[0] % strNumbers.length;
    // let f0 = Math.floor( basePoker[0] / strNumbers.length );
    // let v1 = basePoker[1] % strNumbers.length;
    // let f1 = Math.floor( basePoker[1] / strNumbers.length );
    // console.log( "p0 : ", basePoker[0], v0, f0, " HEX : 0x" + basePoker[0].toString(16) );
    // console.log( "p1 : ", basePoker[1], v1, f1, " HEX : 0x" + basePoker[1].toString(16) );

    // if( v0 == 0 ) v0 = strNumbers.length + 1;
    // if( v1 == 0 ) v1 = strNumbers.length + 1;

    // if( v0 == v1 ){
    //   if(  basePoker[0] > basePoker[1] )
    //     console.log( "winner : p1"  );
    //   else
    //     console.log( "winner : p2"  );
    // }else if( v0 > v1 ){
    //   console.log( "winner : p1"  );
    // }else{
    //   console.log( "winner : p2"  );
    // }
  }

  useEffect( () => {
    const pokerBuf = [];
    for( let i = 0 ; i < 52 ; i++ )
    {
      pokerBuf.push( i );
    }
    setBasePoker( FisherYatesShuffle( pokerBuf ) );
  }, [] );

  return (
    <div>
      <div style={{ textAlign: "center" }}><h1>簡易發牌比大小 with ZK-proof </h1></div>
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
    </div>
  );
}
