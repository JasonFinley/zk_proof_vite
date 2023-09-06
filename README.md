# 零知識証明 with react vite web3 smart contract

## 安裝使用套件 Circom & SnarkJS
```bash
npm install -g circom
npm install -g snarkjs
```

## 建立電路檔 .circom file
cd public/circom/
circuit.circom
```rust
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
```
單純比輸入 a, b 二數大小, 輸出 c
注意輸出沒負數(-)  

### step
```bash
circom circuit.circom --r1cs --wasm --sym
```
產出 .r1cs .wasm .sym

注意 pot12_final.ptau 需要用snarkjs 產出(下方有產出方法), 或去github下載
注意 plonk 也可以使用其他演算法例如 groth16，在打指令的時候不要打錯了
```bash
snarkjs plonk setup circuit.r1cs pot12_final.ptau circuit_final.zkey
```
產出 .zkey 裡面已經包含了 proving 和 verification keys 兩種 key
證明鑰匙（Proving Key），用於產生 ZKP
驗證鑰匙（Verification Key），用於驗證其他 Program 產生的 ZKP

網站需要 .wasm && .zkey 2檔案

#### 產出 verifier.sol 智能合約
```bash
snarkjs zkey export solidityverifier circuit_final.zkey verifier.sol
```
產生一個驗證合約，只要「產生證明者」提交他的 proof 到合約中的驗證函式，合約就可以判斷此 ZKP 是否合法
我們也可以繼承這個合約並且加上自己想要的系統設計，成為一個可以驗證零知識證明的 Dapps！
我們部署 Verifier.sol 即可

#### command 手動驗証
驗證需要 Verification Key（verification_key.json）、witness（proof.json）、Public Information（public.json） 三者

##### Export verification key
```bash
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json
```

##### Calculate Witness
input.json
```json
{ "a": "3", "b" : "6" }
```

```bash
snarkjs wtns calculate circuit.wasm input.json witness.wtns
```
Witness 為隱私資訊，是不想漏漏的資料
也有與 witness 相對應的公開資料，可視系統設計而定
這一步會需要輸入值，以 input.json 的形式輸入

##### Generate proof and public info
```bash
snarkjs plonk prove circuit_final.zkey witness.wtns proof.json public.json
```
會產出這兩個結果：
proof.json: 包含 zk-proof
public.json: 包含 public 的 input 和 output

##### Verify proof
```bash
snarkjs plonk verify verification_key.json public.json proof.json
```
驗證需要 Verification Key（verification_key.json）、witness（proof.json）、Public Information（public.json） 三者
如果 Proof 是合法的，我們可以看見 command 會輸出結果 OK
一個合法的結果不只是我們知道符合電路的 signal 組合，也證明了 public 的 input 和 output 跟 public.json 檔案中的定義相符
##### Generate calldata
```bash
snarkjs zkey export soliditycalldata public.json proof.json
```
藉由以上這個指令自動產出一個 calldata，直接複製就可以作為輸入函式的參數。
Verifier Contract 裡面會有一個 view function 叫做 verifyProof，我們可以提交 proof 給這個函式並且得到回傳值，如果 proof 合法則為 TRUE，反之則為 FALSE

#### pot12_final.ptau 產生方法
```bash
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
```
```bash
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v
```
中途會需要輪入字串
```bash
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
```


## Installation

Install the template with [thirdweb create](https://portal.thirdweb.com/cli/create)

```bash
 npx thirdweb create --template cra-javascript-starter
```

## Run Locally

Install dependencies

Start the server

```bash
npm run dev
```
