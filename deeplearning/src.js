// NN
function NN(input, w, b) {
  let x = []
  x[0] = input
  for(let i = 0; i < w.length; i++) { // 重み階層i
    x[i + 1] = []
    for(let k = 0; k < w[i].length; k++) { // 次階層の個数回k
      x[i + 1][k] = 0
    }
    for(let j = 0; j < w[i][0].length; j++) { // 階層の個数回j
      for(let k = 0; k < w[i].length; k++) { // 次階層の個数回k
        x[i + 1][k] = sg2(x[i][j] * w[i][k][j] + x[i + 1][k])
      }
    }
    // バイアス&活性化関数
    for(let k = 0; k < x[i + 1].length; k++) {
      console.log('前' + x[i + 1][k])
      x[i + 1][k] = af(x[i + 1][k] + sg2(b[i][k]))
      console.log('後' + x[i + 1][k])
    }
  }
  return x[w.length]
}
// NN評価
function updateNN(output, reward, w, b) {
  let input = [value]
  let x = []
  x[0] = input

  let delta = []
  for(let i = 0; i < output.length; i++) {
    delta[i] = (reward - output[i]) * output[i] * (1 - output[i])//シグモイド関数
  }

  // 誤差逆伝播
  for(let i = w.length - 1; i >= 0; i--) {
    let nextDelta = []
    for(let j = 0; j < w[i][0].length; j++) {
      nextDelta[j] = 0
      for(let k = 0; k < w[i].length; k++) {
        nextDelta[j] += delta[k] * w[i][k][j] * (x[i][j] > 0 ? 1 : 0)//活性化関数
      }
    }
    delta = nextDelta
  }

  // 重みとバイアスの更新
  for(let i = 0; i < w.length; i++) {
    for(let j = 0; j < w[i].length; j++) {
      for(let k = 0; k < w[i][0].length; k++) {
        w[i][j][k] -= delta[k] * x[i][j]
      }
      b[i][j] -= delta[j]
    }
  }
  
  // 更新した重みとバイアスを返す
  return [w, b]
}

//小数第二位を四捨五入 3.64 -> 3.6
function sg1(x) {
  return Math.round(x * 10) / 10
}
//小数第三位を四捨五入 3.645 -> 3.65
function sg2(x) {
  return Math.round(x * 100) / 100
}
//活性化関数（ReLU関数）
function af(x){
  if( x >= 0 ) return x
  else return 0
}
//ランダム0~1
function random01() {
  return sg1(Math.random())
}
//重みランダム生成
function generateW(newron) {
  let w = []
  for(i = 0; i < newron.length -1; i++) {//層
    w[i] = []
    for(j = 0; j < newron[i+1]; j++) {//行先
      w[i][j] = []
      for(k = 0; k < newron[i]; k++) {
        w[i][j][k] = random01()
      }
    }
  }
  return w
}
//バイアスランダム生成
function generateB(newron){
  let b = []
  for(i = 0; i < newron.length -1; i++) {
    b[i] = []
    for(j = 0; j < newron[i+1]; j++) {
      b[i][j] = random01()
    }
  }
  return b
}

//////////////////////////　せっていは
//        ↓    ↓        //　　ここよりしたに
//////////////////////////　　　かいてくれ

//初期設定
const Input = [ 1, 2, 3, 4, 5, 6, 7, 8 ]
const Newron = [8, 4, 2]
const W = generateW(Newron)
const B = generateB(Newron)

console.log(W)
console.log(B)

let output = NN(Input, W, B)
// let reward
//let [w2, b2] = updateNN(0, W, B)


/* 一例
let Input = [1,0,0,0, ~ ,1,0,1,0]
let Newron = [605, 300, 100, 4]
let W = generateW(Newron)
let B = generateB(Newron)
loop {
  let output = NN(Input, W, B)
  let reward = 報酬関数など()
  updateNN(output, reward, w, b)
}
*/