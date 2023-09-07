export const snarkjs = window.snarkjs;

const WASM = "/public/circom/circuit.wasm";
const ZKEY = "/public/circom/circuit_final.zkey";

export const ZKPCompareNumbers = async ( numberA, numberB ) => {
    const {proof, publicSignals} = await snarkjs.plonk.fullProve({ a: 11, b: 3 }, WASM, ZKEY);

    return {
        BN_proofs : proof,
        BN_signals: publicSignals,
    }
}
