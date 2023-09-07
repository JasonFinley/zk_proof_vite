// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./interfaces/IVerifier.sol";

contract PokerCompareVerifier{

    //Flower => 0 : Club, 1 : Diamond, 2 : Heart, 3 : Spade
    struct PokerGame{
        uint64 valueA;
        uint32 flowerA;
        uint64 valueB;
        uint32 flowerB;
        uint64 winner; // 0 : ??, 1 : A, 2 : B
    }

    address public _poker_verifier;

    uint256 public _total_supply = 0;
    mapping( uint256 => PokerGame ) public _games;

    event ComparePoker( address indexed caller, uint256 compare, uint256 numberA, uint256 numberB );

    constructor( address verifier ){
        _poker_verifier = verifier;
    }

    function pokerVerifier(
        uint256[24] calldata _proof,
        uint256[3] calldata _pubSignals
    ) public {

        bool bRes = IPlonkVerifier( _poker_verifier ).verifyProof( _proof, _pubSignals );
        require( bRes, "ERROR : verify proof" );
        uint256 compare = _pubSignals[0];
        uint256 numberA = _pubSignals[1];
        uint256 numberB = _pubSignals[2];

        _total_supply += 1;
        _games[ _total_supply ] = PokerGame(
            uint64(numberA % 13), 
            uint32(numberA / 13),
            uint64(numberB % 13), 
            uint32(numberB / 13),
            uint64(compare)
        );

        emit ComparePoker( msg.sender, compare, numberA, numberB );
    }

}