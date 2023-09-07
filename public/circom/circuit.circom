
template CompareNumber() {
    signal input a;
    signal input b;
    signal output c;

    var Aflower = a / 13;
    var AValue = a % 13;
    var Bflower = b / 13;
    var BValue = b % 13;

    if( AValue == 0 )
        AValue = 14;
    if( BValue == 0 )
        BValue = 14;
    
    if( AValue == BValue ){
        if( Aflower == Bflower ){
            c = 0;
        }else if( Aflower > Bflower ){
            c = 1;
        }else{
            c = 2;
        }
    }else if( AValue > BValue ){
        c = 1;
    }else{
        c = 2;
    }
 }

 component main = CompareNumber();