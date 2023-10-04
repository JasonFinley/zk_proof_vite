import { useContract, useAddress } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { ZKPComparePokers } from "../ZKPComparePokers";

const contractAddress = "0xA519A3A8e37C5f542AA3c3Ad73A9c8E879Ac63FF";
const contractABI = [{"inputs":[{"internalType":"address","name":"verifier","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":false,"internalType":"uint256","name":"compare","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"pokersA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"pokersB","type":"uint256"}],"name":"ComparePoker","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_games","outputs":[{"internalType":"uint256","name":"startIdxPokerA","type":"uint256"},{"internalType":"uint256","name":"startIdxPokerB","type":"uint256"},{"internalType":"uint64","name":"winner","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_pokersA","outputs":[{"internalType":"uint8","name":"value","type":"uint8"},{"internalType":"uint8","name":"flower","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_pokersB","outputs":[{"internalType":"uint8","name":"value","type":"uint8"},{"internalType":"uint8","name":"flower","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_total_supply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"idx","type":"uint256"}],"name":"getPokersA","outputs":[{"components":[{"internalType":"uint8","name":"value","type":"uint8"},{"internalType":"uint8","name":"flower","type":"uint8"}],"internalType":"struct PokersCompareVerifier.Poker[5]","name":"","type":"tuple[5]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"idx","type":"uint256"}],"name":"getPokersB","outputs":[{"components":[{"internalType":"uint8","name":"value","type":"uint8"},{"internalType":"uint8","name":"flower","type":"uint8"}],"internalType":"struct PokersCompareVerifier.Poker[5]","name":"","type":"tuple[5]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[24]","name":"_proof","type":"uint256[24]"},{"internalType":"uint256[11]","name":"_pubSignals","type":"uint256[11]"}],"name":"pokerVerifier","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];

export default function PagePokers() {

  const walletAddress = useAddress();
  const { contract } = useContract( contractAddress, contractABI );

  const [ cardPlayer01, setCardPlayer01 ] = useState([]);
  const [ cardPlayer02, setCardPlayer02 ] = useState([]);
  const [ cardTypePlayer01, setCardTypePlayer01] = useState({
    value: 0,
    type: "",
  });
  const [ cardTypePlayer02, setCardTypePlayer02] = useState({
    value: 0,
    type: "",
  });

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
    console.log( " @@@ handleNewGame @@@" );
    setBasePoker( ( pre ) => {
      const newRand = [...pre];
      return FisherYatesShuffle( newRand );
    } );
    setWinner("");
  }

  const solidityVerifier = async ( numberA, numberB ) => {
    try {
      const calldata = await ZKPComparePokers( numberA, numberB );
      //console.log( calldata );
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

    if( walletAddress == null || walletAddress == undefined ){
      alert("Please Connect Wallet!!")
      return;
    }

    solidityVerifier( cardPlayer01, cardPlayer02 );
  }

  const getFullHouse = ( arrayNumbers ) => {

    for( let i = 0 ; i < arrayNumbers.length ; i++ )
    {
      let value = arrayNumbers[i] % 13;
      let cnt = 0;
      for( let j = 0 ; j < arrayNumbers.length ; j++ )
      {

        if( value == arrayNumbers[j] % 13 ){
          cnt += 1;
        }

        if( cnt >= 3 )
          return arrayNumbers[j];
        
      }

    }

    return -1;
  }

  const getThree = ( arrayNumbers ) => {

    for( let i = 0 ; i < arrayNumbers.length ; i++ )
    {
      let value = arrayNumbers[i] % 13;
      let cnt = 0;
      for( let j = 0 ; j < arrayNumbers.length ; j++ )
      {

        if( value == arrayNumbers[j] % 13 ){
          cnt += 1;
        }

        if( cnt >= 3 )
          return arrayNumbers[j];

      }

    }

    return -1;
  }

  const getPair = ( arrayNumbers ) => {

    for( let i = 0 ; i < arrayNumbers.length ; i++ )
    {
      let value = arrayNumbers[i] % 13;
      let cnt = 0;
      for( let j = 0 ; j < arrayNumbers.length ; j++ )
      {

        if( value == arrayNumbers[j] % 13 ){
          cnt += 1;
        }

        if( cnt >= 2 )
          return arrayNumbers[j];

      }

    }

    return -1;
  }

  const getTwoPair = ( arrayNumbers ) => {

    let pair01;
    let pair02;

    for( let i = 0 ; i < arrayNumbers.length ; i++ )
    {
      let value = arrayNumbers[i] % 13;
      let cnt = 0;
      for( let j = 0 ; j < arrayNumbers.length ; j++ )
      {

        if( value == arrayNumbers[j] % 13 ){
          cnt += 1;
        }

        if( cnt >= 2 ){
          pair01 = arrayNumbers[j];
          break;
        }

      }

      if( cnt >= 2 )
        break;

    }

    for( let i = 0 ; i < arrayNumbers.length ; i++ )
    {
      let value = arrayNumbers[i] % 13;
      let cnt = 0;
      for( let j = 0 ; j < arrayNumbers.length ; j++ )
      {
        if( pair01 % 13 != arrayNumbers[j] % 13 ){
          if( value == arrayNumbers[j] % 13 ){
            cnt += 1;
          }
        }

        if( cnt >= 2 ){
          pair02 = arrayNumbers[j];
          break;
        }

      }

      if( cnt >= 2 )
        break;

    }

    if( pair01 % 13 > pair02 % 13 ){
      return pair01;
    }else{
      return pair02;
    }

    return -1;
  }

  const getFlush = ( arrayNumbers ) => {

    let cnt = 0;
    let baseV = arrayNumbers[0];
    for( let i = 1 ; i < arrayNumbers.length ; i++ )
    {
      let v = Math.floor( arrayNumbers[i] / 13 );
      if( Math.floor( baseV / 13 ) != v )
        return -1;
      
      baseV = arrayNumbers[i];
    }

    return baseV;
  }

  const getStraight = ( arrayNumbers ) => {

    let straightIdx = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0 ];
    let lastV;
    for( let i = 0 ; i < arrayNumbers.length - 1; i++ )
    {
      let valueIdx = arrayNumbers[i] % 13;
      let nextValueIdx = arrayNumbers[i+1] % 13;
      if( straightIdx[ valueIdx + 1 ] != straightIdx[ nextValueIdx ] )
        return -1;
      lastV = arrayNumbers[i+1];
    }
    return lastV;
  }

  const getStraightFlush = ( arrayNumbers ) => {

    let v;
    v = getFlush( arrayNumbers );
    if( v < 0 )
      return -1;
    v = getStraight( arrayNumbers );
    if( v < 0 )
      return -1;
    
    return v;
  }

  const checkPokerType = ( arrayNumbers ) => {
  // type = 0 : High card;        //散牌
  // type = 1 : One Pair;         //對子
  // type = 2 : Two Pairs;        //兩對
  // type = 3 : Three of a kind;  //三條
  // type = 4 : Straight;         //順子
  // type = 5 : Flush;            //同花
  // type = 6 : Full house;       //葫蘆
  // type = 7 : Four of a Kind;   //鐵支
  // type = 8 : Straight Flush;   //同花順
    let strIdx = 0;
    let value = 0;
    const strType = [ "散牌", "對子", "兩對", "三條", "順子", "同花", "葫蘆", "鐵支", "同花順" ];
    let flowerCount = [ 0, 0, 0, 0];
    let valueCount = [];
    let i;
    for( i = 0 ; i < 13 ; i++ )
      valueCount.push(0);

    for( i = 0 ; i < arrayNumbers.length ; i++)
    {
      let idxV = arrayNumbers[i] % 13;
      let idxF = Math.floor( arrayNumbers[i] / 13 );
      valueCount[ idxV ] += 1;
      flowerCount[ idxF ] += 1;
    }

    let res = 1;
    for( i = 0 ; i < 13 ; i++ )
    {
      if( valueCount[i] == 4 )//鐵支
        return strType[ 7 ];
      if( valueCount[i] >= 2 ){
        res *= valueCount[i];
      }
    }

    if( res > 1 ){
      // 對子類
      if( res == 6 ){//葫蘆

        value = getFullHouse( arrayNumbers );
        strIdx = 6;

      }else if( res == 3 ){//三條

        value = getThree( arrayNumbers );
        strIdx = 3;

      }else if( res == 2 ){//對子

        value = getPair( arrayNumbers );
        strIdx = 1;

      }else if( res == 4 ){//兩對

        value = getTwoPair( arrayNumbers );
        strIdx = 2;

      }else{
        value = 0;
        strIdx = 0;
        console.warn( "nothing ? ", arrayNumbers );
      }

    }else{

      let v;
      //順子 ? 同花 或沒有
      if( v = getStraightFlush( arrayNumbers ) >= 0 ){
        value = v;
        strIdx = 8;
      }else if( v = getFlush( arrayNumbers ) >= 0 ){
        value = v;
        strIdx = 5;
      }else if( v = getStraight( arrayNumbers ) >= 0 ){
        value = v;
        strIdx = 4;
      }else{

        let lastV = arrayNumbers[0];
        for( let i = 1 ; i < arrayNumbers.length ; i++ )
        {
          let v = (lastV % 13);
          let curV = (arrayNumbers[i] % 13);
          if( curV == v ){
            lastV = Math.max( lastV, arrayNumbers[i] );
          }else{

            if( v == 0 || curV == 0 ){

              if( curV == 0 ){
                lastV = arrayNumbers[i];
              }else if( v == 0 ){
                continue;
              }
              
            }else if( curV > v){
              lastV = arrayNumbers[i];
            }

          }

        }
        value = lastV;
        strIdx = 0;
      }

    }


    return {
      value: value,
      type: strType[ strIdx ]
    }
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

        // demo 2 players 
    if( basePoker.length < 10 )
      return;

    const player01 = [];
    const player02 = [];
    
    for( let i = 0 ; i < 10 ; i++ )
    {
      if( i % 2 == 0 ){
        player01.push( basePoker[i] );
      }else{
        player02.push( basePoker[i] );
      }
    }

    // player01.push( 17 );
    // player01.push( 18 );
    // player01.push( 19 );
    // player01.push( 20 );
    // player01.push( 21 );

    // player02.push( 4 );
    // player02.push( 6 );
    // player02.push( 7 );
    // player02.push( 9 );
    // player02.push( 10 );

    const sortPlayer01 = player01.sort( (a, b) => { return a - b } );
    const sortPlayer02 = player02.sort( (a, b) => { return a - b } );
    setCardPlayer01( sortPlayer01 );
    setCardPlayer02( sortPlayer02 );

    const strType01 = checkPokerType( sortPlayer01 );
    const strType02 = checkPokerType( sortPlayer02 );
    setCardTypePlayer01( strType01 );
    setCardTypePlayer02( strType02 );

    console.log( player01 );
    console.log( player02 );

  }, [ basePoker ] );

  return (
    <div>
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
        <div style={{ width: "300px", backgroundColor: "#333333", textAlign: "center", borderWidth: "2px", borderColor: "purple", borderStyle: "solid", paddingBottom: "4px" }}>
          <h3>Player 01</h3>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", width: "100%", justifyContent:"center" }}>
            {
              cardPlayer01.map( (item, idx) => {
                return (
                  <div key={idx} style={{ marginLeft: "4px", marginRight: "4px", borderWidth: "2px", borderColor: "yellow", borderStyle: "solid", paddingLeft: "4px", paddingRight: "4px" }}>
                    <p>{ strNumbers[ item % strNumbers.length ] }</p>
                    <p style={{ fontSize: "14px" }}>{ strFlowers[ Math.floor( item / strNumbers.length) ] }</p>
                  </div>
                )
              } )
            }
            </div>
            {/* <p>{ strNumbers[ basePoker[0] % strNumbers.length ] }</p>
            <p>{ strFlowers[ Math.floor(basePoker[0] / strNumbers.length) ] }</p> */}
          </div>
          <h4>{ `${ strNumbers[cardTypePlayer01.value % 13] } ${ strFlowers[Math.floor(cardTypePlayer01.value / 13)] } ${cardTypePlayer01.type}` }</h4>
        </div>
        <div style={{ width: "300px", backgroundColor: "#333333", textAlign: "center", borderWidth: "2px", borderColor: "purple", borderStyle: "solid", paddingBottom: "4px" }}>
          <h3>Player 02</h3>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", width: "100%", justifyContent:"center" }}>
            {
              cardPlayer02.map( (item, idx) => {
                return (
                  <div key={idx} style={{ marginLeft: "4px", marginRight: "4px", borderWidth: "2px", borderColor: "yellow", borderStyle: "solid", paddingLeft: "4px", paddingRight: "4px" }}>
                    <p>{ strNumbers[ item % strNumbers.length ] }</p>
                    <p style={{ fontSize: "14px" }}>{ strFlowers[ Math.floor( item / strNumbers.length) ] }</p>
                  </div>
                )
              } )
            }
            </div>
          </div>
          <h4>{ `${ strNumbers[cardTypePlayer02.value % 13] } ${ strFlowers[Math.floor(cardTypePlayer02.value / 13)] } ${cardTypePlayer02.type}` }</h4>
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
