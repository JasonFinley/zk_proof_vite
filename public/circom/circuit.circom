
template CompareNumber() {
    signal input a;
    signal input b;
    signal output c;
    if( a == b ){
        c = 0;
    }else if( a > b ){
        c = 1;
    }else{
        c = 2;
    }
 }

 component main = CompareNumber();