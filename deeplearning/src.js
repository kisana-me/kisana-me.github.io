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
      x[i + 1][k] = af2(x[i + 1][k] + sg2(b[i][k]))
    }
  }
  return {'last': x[w.length], 'x': x}
}
//小数第三位を四捨五入 3.645 -> 3.65
function sg2(x) {
  return Math.round(x * 100) / 100
}
//活性化関数（ReLU関数）
function af(x){
  return Math.max(0, x)
}
//活性化関数（シグモイド関数）
function af2(x){
  return 1 / (1 + Math.exp(-x))
}
// NN評価
function updateNN(output, reward, x, w, b, learningRate) {
  let delta = []
  for(let i = 0; i < output.length; i++) {
    delta[i] = (reward - output[i]) * output[i] * (1 - output[i])
  }
  // 誤差逆伝播
  for(let i = w.length - 1; i >= 0; i--) {
    let nextDelta = []
    for(let j = 0; j < w[i][0].length; j++) {
      nextDelta[j] = 0
      for(let k = 0; k < w[i].length; k++) {
        nextDelta[j] += delta[k] * w[i][k][j] * (x[i][j] > 0 ? 1 : 0)
      }
    }
    delta = nextDelta
  }
  // 重みとバイアスの更新
  for(let i = 0; i < w.length; i++) {
    for(let j = 0; j < w[i].length; j++) {
      for(let k = 0; k < w[i][0].length; k++) {
        w[i][j][k] -= learningRate * delta[k] * x[i][j]
      }
      b[i][j] -= learningRate * delta[j]
    }
  }
  // 更新した重みとバイアスを返す
  return [w, b]
}
//小数第二位を四捨五入 3.64 -> 3.6
function sg1(x) {
  return Math.round(x * 10) / 10
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
/*
//初期設定
const Input = [ 1, 2, 3, 4, 5, 6, 7, 8 ]
const Newron = [8, 6, 4]
let W = generateW(Newron)
let B = generateB(Newron)
const learningRate = 0.1

//周回
for(i = 0; i < 3; i++){
  let output = NN(Input, W, B)
  let reward = 0.1
  let updated = updateNN(output.last, reward, output.x, W, B, learningRate)
  W = updated[0]
  B = updated[1]
  console.log(output.last)
}
*/