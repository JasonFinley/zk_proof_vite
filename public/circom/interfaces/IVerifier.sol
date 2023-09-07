// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IPlonkVerifier {
    function verifyProof(uint256[24] calldata _proof, uint256[3] calldata _pubSignals) external view returns (bool);
}