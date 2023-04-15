// Canvas要素を取得
const canvas = document.getElementById('tegaki')
// Canvasの描画コンテキストを取得
const ctx = canvas.getContext('2d')
// Canvasのサイズを設定
canvas.width = 200
canvas.height = 200
// ペンの設定
ctx.lineWidth = 1
ctx.strokeStyle = '#000000'
// 描画フラグを設定
let isDrawing = false

// 描画開始時の処理
function startDrawing(event) {
  isDrawing = true
  getCursorPosition(event)
}
// 描画終了時の処理
function stopDrawing() {
  isDrawing = false
  ctx.beginPath()
}
let dataX = []
let dataY = []
function clearData() {
  for (let i = 0; i < 20; i++) {
    dataX = []
    dataY = []
    dataX.push(0);
    dataY.push(0);
  }
}
clearData()
// クリックされた場所を取得する関数
function getCursorPosition(event) {
  if (!isDrawing) return
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const squareX = Math.floor(x / 10) * 10;
  const squareY = Math.floor(y / 10) * 10;
  ctx.fillRect(squareX, squareY, 10, 10);
  
  dataX[squareX/10] = 1
  dataY[squareY/10] = 1
  console.log(dataX,dataY)
}
let paths = [];
function savePath() {
  paths.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
}
function undo() {
  if (paths.length === 0) return
  paths.pop()
  redraw()
}
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  paths.forEach((path) => {
    ctx.putImageData(path, 0, 0)
  })
}
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  paths = []
  clearData()
}
// イベントリスナーを設定
canvas.addEventListener('mousedown', startDrawing)
canvas.addEventListener('mousemove', getCursorPosition)
canvas.addEventListener('mouseup', stopDrawing)
canvas.addEventListener("mouseup", () => {
  savePath()
})
document.getElementById("undo").addEventListener("click", () => {
  undo()
})
canvas.addEventListener('mouseout', stopDrawing)
document.getElementById("clear").addEventListener("click", () => {
  clearCanvas()
})
// 出力

