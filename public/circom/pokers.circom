function FullHouse( a, b, c, d, e ){
    var x[5] = [ a, b, c, d, e];
    var res = 9999;

    for( var i = 0 ; i < 5 ; i++ )
    {
      var value = x[i] % 13;
      var cnt = 0;
      for( var j = 0 ; j < 5 ; j++ )
      {

        if( value == x[j] % 13 ){
          cnt += 1;
        }

        if( cnt >= 3 ){
            res = x[j];
            j += 5;
            i += 5;
        }
        
      }

    }

    return res;
}

function Four( a, b, c, d, e ){
    var x[5] = [ a, b, c, d, e ];
    var res = 9999;

    for( var i = 0 ; i < 5 ; i++ )
    {
      var value = x[i] % 13;
      var cnt = 0;
      for( var j = 0 ; j < 5 ; j++ )
      {

        if( value == x[j] % 13 ){
          cnt += 1;
        }

        if( cnt >= 4 ){
          res = x[j];
          j += 5;
          i += 5;
        }

      }

    }

    return res;
}

function Three( a, b, c, d, e ){
    var x[5] = [ a, b, c, d, e ];
    var res = 9999;

    for( var i = 0 ; i < 5 ; i++ )
    {
      var value = x[i] % 13;
      var cnt = 0;
      for( var j = 0 ; j < 5 ; j++ )
      {

        if( value == x[j] % 13 ){
          cnt += 1;
        }

        if( cnt >= 3 ){
          res = x[j];
          j += 5;
          i += 5;
        }

      }

    }

    return res;
}

function Pair( a, b, c, d, e ){
    var x[5] = [ a, b, c, d, e ];
    var res = 9999;

    for( var i = 0 ; i < 5 ; i++ )
    {
        var value = x[i] % 13;
        var cnt = 0;
        for( var j = 0 ; j < 5 ; j++ )
        {

            if( value == x[j] % 13 ){
                cnt += 1;
            }

            if( cnt >= 2 ){
                res = x[j];
                j += 5;
                i += 5;
            }

        }
    }

    return res;
}

function TwoPair( a, b, c, d, e ){
    var x[5] = [ a, b, c, d, e ];
    var res;

    var pair01 = 9999;
    var pair02 = 9999;

    for( var i = 0 ; i < 5 ; i++ )
    {
        var value = x[i] % 13;
        var cnt = 0;

        for( var j = 0 ; j < 5 ; j++ )
        {

            if( value == x[j] % 13 ){
                cnt += 1;
            }

            if( cnt >= 2 ){

                if( pair01 == 9999 ){
                    pair01 = x[j];
                    j += 5;
                }else if( pair02 == 9999 ){
                    pair02 = x[j];
                    j += 5;
                }

                if( pair02 != 9999 && pair01 % 13 == pair02 % 13 ){
                    pair02 = 9999;
                    j += 5;
                }

            }

        }

        if( pair01 != 9999 && pair02 != 9999 && pair01 % 13 != pair02 % 13 ){
            i += 5;
        }

    }

    if( pair01 == 9999 || pair02 == 9999 ){
        res = 9999;
    }else{

        if( pair01 % 13 > pair02 % 13 ){
            res = pair01;
        }else{
            res = pair02;
        }

    }

    return res;

}

template Flush(){
    signal input numbers[5];
    signal output out;
    var res = 9999;

    var baseV = numbers[0];
    for( var i = 1 ; i < 5 ; i++ )
    {
        var v = numbers[i] \ 13;
        var bv = baseV \ 13;
        if( bv == v ){
            baseV = numbers[i];
            res = baseV;
        }else{
            res = 9999;
            i += 5;
        }
        
    }

    out <== res;

}

template Straight(){
    signal input numbers[5];
    signal output out;
    var res = 9999;

    var straightIdx[15] = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0 ];
    var lastV = 0;
    for( var i = 0 ; i < 4; i++ )
    {
      var valueIdx = numbers[i] % 13;
      var nextValueIdx = numbers[i+1] % 13;
      if( straightIdx[ valueIdx + 1 ] == straightIdx[ nextValueIdx ] && res == 9999 ){
        lastV = numbers[i+1];
      }else{
        res = 9998;
      }
      
    }

    if( res == 9998 ){
        out <== 9999;
    }else{
        out <== lastV;
    }
}

function highNumber( a, b, c, d, e ){

    var x[5] = [ a, b, c, d, e ];

    var maxV = x[0];
    for( var i = 1 ; i < 5 ; i++ )
    {
        var v = x[i] % 13;
        var f = x[i] \ 13;
        var cv = maxV % 13;
        var cf = maxV \ 13;

        if( v == 0 ) v = 14;
        if( cv == 0 ) cv = 14;

        if( cv < v ){
            maxV = x[i];
        }else if( cv == v ){
            if( cf < f ){
                maxV = x[i];
            }
        }
    }

    return maxV;
}

template CheckNumbers(){
    signal input numbers[5];
    signal output out;

    var valueCount[13] = [0,0,0,0,0,0,0,0,0,0,0,0,0];
    var i;
    var res = 1;
    var returnOut = 9999;
    for( i = 0 ; i < 5 ; i++ )
    {
        var idxV = numbers[i] % 13;
        valueCount[ idxV ] += 1;
    }

    // type = 0 : High card;        //散牌
    // type = 1 : One Pair;         //對子
    // type = 2 : Two Pairs;        //兩對
    // type = 3 : Three of a kind;  //三條
    // type = 4 : Straight;         //順子
    // type = 5 : Flush;            //同花
    // type = 6 : Full house;       //葫蘆
    // type = 7 : Four of a Kind;   //鐵支
    // type = 8 : Straight Flush;   //同花順 

    for( i = 0 ; i < 13 ; i++ )
    {
        if( valueCount[i] >= 4 ){
            res = 7;
        }else{
            if( valueCount[i] >= 2 ){
                res *= valueCount[i];
            }
        }
    }
    //log( res );
    if( res > 1 ){
        // 對子類

        if( res == 6 ){//葫蘆

            var tmp = FullHouse( numbers[0], numbers[1], numbers[2], numbers[3], numbers[4] );
            returnOut = 6 * 1000 + tmp;

        }else if( res == 3 ){//三條

            var tmp = Three( numbers[0], numbers[1], numbers[2], numbers[3], numbers[4] );
            returnOut = 3 * 1000 + tmp;

        }else if( res == 2 ){//對子

            var tmp = Pair( numbers[0], numbers[1], numbers[2], numbers[3], numbers[4] );
            returnOut = 1 * 1000 + tmp;

        }else if( res == 4 ){//兩對

            var tmp = TwoPair( numbers[0], numbers[1], numbers[2], numbers[3], numbers[4] );
            returnOut = 2 * 1000 + tmp;

        }else if( res == 7 ){//鐵支

            var tmp = Four( numbers[0], numbers[1], numbers[2], numbers[3], numbers[4] );
            returnOut = 7 * 1000 + tmp;

        }else{
            returnOut = 9999;
        }

        //log( returnOut );

    }else{

        var resFlush = 9999;
        var resStraight = 9999;
        component valueFlush = Flush();
        component valueStraight = Straight();
        //順子 ? 同花 或沒有
        for( i = 0 ; i < 5 ; i++ )
        {
            valueFlush.numbers[i] <== numbers[i];
            valueStraight.numbers[i] <== numbers[i];
        }

        resFlush = valueFlush.out;
        resStraight = valueStraight.out;
        if( resFlush != 9999 && resStraight != 9999 ){
            returnOut = 8 * 1000 + resStraight;
        }else if( resFlush != 9999 ){
            returnOut = 5 * 1000 + resFlush;
        }else if( resStraight != 9999 ){
            returnOut = 4 * 1000 + resStraight;
        }else{

            var high = highNumber( numbers[0], numbers[1], numbers[2], numbers[3], numbers[4] );
            returnOut = 0 * 1000 + high;
        }
    }

    out <== returnOut;
}

template ComparePokers() {
    signal input a[5];
    signal input b[5];
    signal output c;

    component pokersA = CheckNumbers();
    component pokersB = CheckNumbers();
    for( var i = 0 ; i < 5 ; i++ )
    {
        pokersA.numbers[i] <== a[i];
        pokersB.numbers[i] <== b[i];
    }

    var vA = pokersA.out;
    var vB = pokersB.out;
    var res = 0;
    var typeA = vA \ 1000;
    var typeB = vB \ 1000;
    var valueA = vA % 1000;
    var valueB = vB % 1000;

    if( typeA > typeB ){
        res = 1;
    }else if( typeB > typeA ){
        res = 2;
    }else{

        var nA = valueA % 13;
        var nB = valueB % 13;
        var fA = valueA \ 13;
        var fB = valueB \ 13;
        
        if( nA == 0 ) nA = 14;
        if( nB == 0 ) nB = 14;

        if( nA > nB ){
            res = 1;
        }else if( nB > nA ){
            res = 2;
        }else if( fA > fB ){
            res = 1;
        }else if( fB > fA ){
            res = 2;
        }else{
            res = 3;
        }

    }

    c <== res;
    
 }

 component main = ComparePokers();