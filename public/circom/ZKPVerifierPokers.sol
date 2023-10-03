// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "hardhat/console.sol";
import "./iverifier_pokers.sol";

contract PokersCompareVerifier {

    struct Poker{
        uint8 value;
        uint8 flower;
    }

    //Flower => 0 : Club, 1 : Diamond, 2 : Heart, 3 : Spade
    struct PokerGame{
        uint256 startIdxPokerA;
        uint256 startIdxPokerB;
        uint64 winner; // 0 : ??, 1 : A, 2 : B
    }

    address _iverifier;
    uint256 public _total_supply = 0;
    Poker[] public _pokersA;
    Poker[] public _pokersB;
    mapping( uint256 => PokerGame ) public _games;

    event ComparePoker( address indexed caller, uint256 compare, uint256 pokersA, uint256 pokersB );

    constructor( address verifier ){
        _iverifier = verifier;
    }

    function getPokersA( uint256 idx ) public view returns ( Poker[5] memory ){
        Poker[5] memory poker;
        for( uint256 i = idx ; i < idx + 5 ; i++ )
        {
            poker[i] = _pokersA[i];
        }
        return poker;
    }

    function getPokersB( uint256 idx ) public view returns ( Poker[5] memory ){
        Poker[5] memory poker;
        for( uint256 i = idx ; i < idx + 5 ; i++ )
        {
            poker[i] = _pokersB[i];
        }
        return poker;
    }

    function pokerVerifier(
        uint256[24] calldata _proof,
        uint256[11] calldata _pubSignals
    ) public returns (bool){

        bool bRes = IPlonkVerifier(_iverifier).verifyProof( _proof, _pubSignals );
        require( bRes, "ERROR : verify proof" );
        
        uint256 compare = _pubSignals[0];

        for( uint i = 0 ; i < 5 ; i++ )
        {
            uint8 vA = uint8(_pubSignals[i + 1] % 13) ;
            uint8 fA = uint8(_pubSignals[i + 1] / 13) ;
            uint8 vB = uint8(_pubSignals[i + 6] % 13) ;
            uint8 fB = uint8(_pubSignals[i + 6] / 13) ;
            _pokersA.push( Poker( vA, fA ) );
            _pokersB.push( Poker( vB, fB ) );
        }

        _total_supply += 1;
        uint256 pokerAidx = _pokersA.length - 5;
        uint256 pokerBidx = _pokersB.length - 5;
        _games[ _total_supply ] = PokerGame( pokerAidx, pokerBidx, uint64(compare) );
        
        emit ComparePoker( msg.sender, compare, pokerAidx, pokerBidx );
        return bRes;
    }

}