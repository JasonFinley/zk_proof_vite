template FullHouse(){
    signal input numbers[5];
    signal output out;
    var res = 9999;

    for( var i = 0 ; i < 5 ; i++ )
    {
      var value = numbers[i] % 13;
      var cnt = 0;
      for( var j = 0 ; j < 5 ; j++ )
      {

        if( value == numbers[j] % 13 ){
          cnt += 1;
        }

        if( cnt >= 3 ){
            res = numbers[j];
        }
        
      }

    }

    out <== res;
}

template Three(){
    signal input numbers[5];
    signal output out;
    var res = 9999;

    for( var i = 0 ; i < 5 ; i++ )
    {
      var value = numbers[i] % 13;
      var cnt = 0;
      for( var j = 0 ; j < 5 ; j++ )
      {

        if( value == numbers[j] % 13 ){
          cnt += 1;
        }

        if( cnt >= 3 ){
          res = numbers[j];
        }

      }

    }

    out <== res;
}

template Pair(){
    signal input numbers[5];
    signal output out;
    var res = 9999;

    for( var i = 0 ; i < 5 ; i++ )
    {
      var value = numbers[i] % 13;
      var cnt = 0;
      for( var j = 0 ; j < 5 ; j++ )
      {

        if( value == numbers[j] % 13 ){
          cnt += 1;
        }

        if( cnt >= 2 ){
            res = numbers[j];
        }

      }

    }

    out <== res;
}

template TwoPair(){
    signal input numbers[5];
    signal output out;

    var pair01 = 9999;
    var pair02 = 9999;

    for( var i = 0 ; i < 5 ; i++ )
    {
        var value = numbers[i] % 13;
        var cnt = 0;

        for( var j = 0 ; j < 5 ; j++ )
        {

            if( value == numbers[j] % 13 ){
                cnt += 1;
            }

            if( cnt >= 2 ){
                if( pair01 == 9999 )
                    pair01 = numbers[j];
                else
                    pair02 = numbers[j];
            }

        }

    }

    if( pair01 == 9999 || pair02 == 9999 ){
        out <== 9999;
    }else{

        if( pair01 % 13 > pair02 % 13 ){
            out <== pair01;
        }else{
            out <== pair02;
        }

    }

}

template Flush(){
    signal input numbers[5];
    signal output out;
    var res = 9999;

    var baseV = numbers[0];
    for( var i = 1 ; i < 5 ; i++ )
    {
      var v = numbers[i] / 13;
      if( (baseV / 13) == v && res == 9999 ){
        baseV = numbers[i];
      }else{
        res = 9998;
      }
        
    }

    if( res == 9998 ){
        out <== 9999;
    }else{
        out <== baseV;
    }

}

template Straight(){
    signal input numbers[5];
    signal output out;
    var res = 9999;

    var straightIdx[15] = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0 ];
    var lastV;
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

template StraightFlush(){
    signal input numbers[5];
    signal output out;
    var res = 9999;

    component flush = Flush();
    component straight = Straight();
    for( var i = 0 ; i < 5 ; i++ )
    {
        flush.numbers[i] <== numbers[i];
        straight.numbers[i] <== numbers[i];
    }

    if( res == flush.out || res == straight.out ){
        out <== 9999;
    }else{
        out <== straight.out;
    }
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
            returnOut = 1000 * 6 + valueCount[i];
        }else{
            if( valueCount[i] >= 2 ){
                res *= valueCount[i];
            }
        }
    }

    if( res > 1 ){
        // 對子類

        component valueFullHouse = FullHouse();
        component valueThree = Three();
        component valuePair = Pair();
        component valueTwoPair = TwoPair();
        for( i = 0 ; i < 5 ; i++ )
        {
            valueFullHouse.numbers[i] <== numbers[i];
            valueThree.numbers[i] <== numbers[i];
            valuePair.numbers[i] <== numbers[i];
            valueTwoPair.numbers[i] <== numbers[i];
        }

        if( res == 6 ){//葫蘆

            returnOut = 6 * 1000 + valueFullHouse.out;

        }else if( res == 3 ){//三條

            returnOut = 3 * 1000 + valueThree.out;

        }else if( res == 2 ){//對子

            returnOut = 1 * 1000 + valuePair.out;

        }else if( res == 4 ){//兩對

            returnOut = 2 * 1000 + valueTwoPair.out;

        }else{
            returnOut = 9999;
        }

    }else{

        component valueStraightFlush = StraightFlush();
        component valueFlush = Flush();
        component valueStraight = Straight();
        //順子 ? 同花 或沒有
        for( i = 0 ; i < 5 ; i++ )
        {
            valueStraightFlush.numbers[i] <== numbers[i];
            valueFlush.numbers[i] <== numbers[i];
            valueStraight.numbers[i] <== numbers[i];
        }
        
        if( valueStraightFlush.out != 9999 ){
            returnOut = 8 * 1000 + valueStraightFlush.out;
        }else if( valueFlush.out != 9999 ){
            returnOut = 5 * 1000 + valueFlush.out;
        }else if( valueStraight != 9999 ){
            returnOut = 4 * 1000 + valueStraight.out;
        }else{

            var lastV = numbers[0];
            for( i = 1 ; i < 5 ; i++ )
            {
                var v = (lastV % 13);
                var curV = (numbers[i] % 13);
                if( curV == v ){

                    if( numbers[i] > lastV ){
                        lastV = numbers[i];
                    }

                }else{

                    if( v == 0 || curV == 0 ){

                        if( curV == 0 ){
                            lastV = numbers[i];
                        }
                    
                    }else if( curV > v){
                        lastV = numbers[i];
                    }

                }

            }

            returnOut = 0 * 1000 + lastV;
        }
    }

    out <== returnOut;
}

template ComparePokers() {
    signal input a[5];
    signal input b[5];
    signal output c;

    var typeA = 0;
    var typeB = 0;
    var resA = 0;
    var resB = 0;

    component valueA = CheckNumbers();
    component valueB = CheckNumbers();
    for( var i = 0 ; i < 5 ; i++ )
    {
        valueA.numbers[i] <== a[i];
        valueB.numbers[i] <== b[i];
    }

    typeA = valueA.out / 1000;
    resA = valueA.out % 1000;
    typeB = valueB.out / 1000;
    resB = valueB.out % 1000;

    if( typeA > typeB ){
        c <== 1;
    }else if( typeB > typeA ){
        c <== 2;
    }else{

        var nA = resA % 13;
        var fA = resA / 13;
        var nB = resB % 13;
        var fB = resB / 13;

        if( nA == 0 ) 
            nA = 14;
        if( nB == 0 ) 
            nB = 14;

        if( nA > nB ){
            c <== 1;
        }else if( nB > nA ){
            c <== 2;
        }else{
            if( fA >= fB ){
                c <== 1;
            }else{
                c <== 2;
            }
        }
    }
 }

 component main = ComparePokers();