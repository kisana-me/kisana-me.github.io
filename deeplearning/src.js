// NN
function NN(input, w, b) {
  let x = []
  x[0] = input
  for (let i = 0; i < w.length; i++) { // 重み階層i
    x[i + 1] = []
    for (let k = 0; k < w[i].length; k++) { // 次階層の個数回k
      x[i + 1][k] = 0
    }
    for (let j = 0; j < w[i][0].length; j++) { // 階層の個数回j
      for (let k = 0; k < w[i].length; k++) { // 次階層の個数回k
        x[i + 1][k] = sg2(x[i][j] * w[i][k][j] + x[i + 1][k])
      }
    }
    // バイアス&活性化関数
    for (let k = 0; k < x[i + 1].length; k++) {
      x[i + 1][k] = af2(x[i + 1][k] + sg2(b[i][k]))
    }
  }
  return { 'last': x[w.length], 'x': x }
}
//小数第三位を四捨五入 3.645 -> 3.65
function sg2(x) {
  return Math.round(x * 100) / 100
}
//活性化関数（ReLU関数）
function af(x) {
  return Math.max(0, x)
}
//活性化関数（シグモイド関数）
function af2(x) {
  return 1 / (1 + Math.exp(-x))
}
// NN評価
function updateNN(output, reward, x, w, b, learningRate) {
  let delta = []
  for (let i = 0; i < output.length; i++) {
    delta[i] = (reward - output[i]) * output[i] * (1 - output[i])
  }
  // 誤差逆伝播
  for (let i = w.length - 1; i >= 0; i--) {
    let nextDelta = []
    for (let j = 0; j < w[i][0].length; j++) {
      nextDelta[j] = 0
      for (let k = 0; k < w[i].length; k++) {
        nextDelta[j] += delta[k] * w[i][k][j]
      }
      // シグモイド関数の微分を適用する
      nextDelta[j] *= output[i] * (1 - output[i]);
    }
    delta = nextDelta
  }
  // 重みとバイアスの更新
  for (let i = 0; i < w.length; i++) {
    for (let j = 0; j < w[i].length; j++) {
      for (let k = 0; k < w[i][0].length; k++) {
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
  for (i = 0; i < newron.length - 1; i++) {//層
    w[i] = []
    for (j = 0; j < newron[i + 1]; j++) {//行先
      w[i][j] = []
      for (k = 0; k < newron[i]; k++) {
        w[i][j][k] = random01()
      }
    }
  }
  return w
}
//バイアスランダム生成
function generateB(newron) {
  let b = []
  for (i = 0; i < newron.length - 1; i++) {
    b[i] = []
    for (j = 0; j < newron[i + 1]; j++) {
      b[i][j] = random01()
    }
  }
  return b
}

//////////////////////////
//        ↓    ↓        //
//////////////////////////
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
function drawNeuralNetwork(x, w, b, canvasId) {
  const canvas = document.getElementById(canvasId)
  const ctx = canvas.getContext("2d")
  const margin = 20
  const neuronRadius = 20
  const height = canvas.height - 2 * margin
  const width = canvas.width - 2 * margin
  // 各層のニューロン数
  const layerSizes = [x[0].length, ...w.map(layer => layer.length)];
  // 各層のニューロンの位置を計算
  const neuronPositions = layerSizes.map((size, layerIndex) => {
    const layerWidth = size * (2 * neuronRadius + margin);
    const layerXOffset = (width - layerWidth) / 2 + margin;
    const layerYOffset = (height - (size - 1) * (2 * neuronRadius + margin)) / 2 + margin;
    return Array.from({ length: size }, (_, i) => ({
      x: layerXOffset,
      y: layerYOffset + i * (2 * neuronRadius + margin),
      layerIndex,
      neuronIndex: i,
    }));
  })
  // ニューロンの値に対応するグレースケールの値を計算するための関数
  const activationToGray = a => Math.round(255 * (1 + a) / 2);

  // ニューロンを描画する関数
  const drawNeuron = (neuron, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(neuron.x, neuron.y, neuronRadius, 0, 2 * Math.PI);
    ctx.fill();
  };

  // 各ニューロンを描画
  neuronPositions.flat().forEach(neuron => {
    const activation = x[neuron.layerIndex][neuron.neuronIndex];
    const gray = activationToGray(activation);
    drawNeuron(neuron, `rgb(${gray}, ${gray}, ${gray})`);
  });

  // 各重みを描画
  w.forEach((layer, layerIndex) => {
    layer.forEach((neuronWeights, neuronIndex) => {
      neuronWeights.forEach((weight, inputIndex) => {
        const startNeuron = neuronPositions[layerIndex][neuronIndex];
        const endNeuron = neuronPositions[layerIndex + 1]?.[inputIndex]; // 修正点
        if (!endNeuron) {
          return;
        }
        const color = weight > 0 ? "black" : "gray";
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.abs(weight) * 3;
        ctx.beginPath();
        ctx.moveTo(startNeuron.x, startNeuron.y);
        ctx.lineTo(endNeuron.x, endNeuron.y);
        ctx.stroke();
      });
    });
  });

  // 各バイアスを描画
  b.forEach((layer, layerIndex) => {
    layer.forEach((bias, neuronIndex) => {
      const neuron = neuronPositions[layerIndex + 1][neuronIndex];
      const color = bias > 0 ? "black" : "gray";
      const absBias = Math.abs(bias);
      const biasRadius = neuronRadius * absBias / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = absBias * 3;
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, biasRadius, 0, 2 * Math.PI);
      ctx.stroke();
    })
  })
}