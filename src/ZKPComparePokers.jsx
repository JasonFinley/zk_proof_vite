import { ethers } from "ethers";

//理論這2檔要在後端
const WASM = "/public/circom/pokers.wasm";
const ZKEY = "/public/circom/pokers_final.zkey";

export const snarkjs = window.snarkjs;

const parseStringToBigNumbers = ( strBuffer ) => {

    //console.log( strBuffer );
    const BN_Buffer = [];
    const tmpBuffer = strBuffer.split( "," );
    tmpBuffer.forEach( (item) => {
        let s = item.indexOf( "0x" );
        let e = item.indexOf( "\"", s + 1 );
        const buf = item.substring( s, e );
        BN_Buffer.push( ethers.BigNumber.from( buf ) );
    } );
    
    return BN_Buffer;
}

export const ZKPComparePokers = async ( pokersA, pokersB ) => {

    const zkpInput = {
        a: [ ...pokersA ],
        b: [ ...pokersB ]
    };

    if( zkpInput.a.length != zkpInput.b.length ){
        return { BN_proofs : null, BN_signals: null }
    }

    console.log( "snarkjs.plonk.fullProve load file maybe too slow..... ;_; ", zkpInput );
    const {proof, publicSignals} = await snarkjs.plonk.fullProve( zkpInput , WASM, ZKEY);
    console.log( "byPass Goooooood !!! ", proof, publicSignals );
    const solidityBuffer = await snarkjs.plonk.exportSolidityCallData( proof, publicSignals );
    let sIdx = solidityBuffer.indexOf( "[" );
    let eIdx = solidityBuffer.indexOf( "]", sIdx + 1 );
    const BN_proofs = parseStringToBigNumbers( solidityBuffer.substring( sIdx, eIdx + 1 ) );
    sIdx = solidityBuffer.indexOf( "[", eIdx + 1 );
    eIdx = solidityBuffer.indexOf( "]", sIdx + 1 );
    const BN_signals = parseStringToBigNumbers( solidityBuffer.substring( sIdx, eIdx + 1) );

    return {
        BN_proofs : BN_proofs,
        BN_signals: BN_signals,
    }
}
