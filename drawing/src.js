
/// Canvasのサイズを設定 ///
const canvas_x = 200
const canvas_y = 200
/// ペンの設定 ///
const dot_size = 5
/// *** ///
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = canvas_x
canvas.height = canvas_y
ctx.strokeStyle = '#000000'
ctx.imageSmoothingEnabled = false
let isDrawing = false

function startDrawing(event) {
  isDrawing = true
  getCursorPosition(event)
}

function stopDrawing() {
  isDrawing = false
  ctx.beginPath()
}

let dataX = []
let dataY = []

function clearData() {
  for (let i = 0; i < canvas_x; i++) {
    dataX = []
    dataX.push(0)
  }
  for (let i = 0; i < canvas_y; i++) {
    dataY = []
    dataY.push(0)
  }
}

clearData()

function getCursorPosition(event) {
  if (!isDrawing) return
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const squareX = Math.floor(x / dot_size) * dot_size
  const squareY = Math.floor(y / dot_size) * dot_size
  ctx.fillRect(squareX, squareY, dot_size, dot_size)
}

let paths = []

function savePath() {
  paths.push(ctx.getImageData(0, 0, canvas_x, canvas_y))
  console.log(paths)
}

function undo() {
  if (paths.length === 0) return
  paths.pop()
  redraw()
}

function redraw() {
  ctx.clearRect(0, 0, canvas_x, canvas_y)
  paths.forEach((path) => {
    ctx.putImageData(path, 0, 0)
  })
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas_x, canvas_y)
  paths = []
  clearData()
}

canvas.addEventListener('mousedown', startDrawing)
canvas.addEventListener('mousemove', getCursorPosition)
canvas.addEventListener('mouseup', stopDrawing)
canvas.addEventListener('mouseout', stopDrawing)
canvas.addEventListener("mouseup", savePath)

document.getElementById("undo").addEventListener("click", undo)
document.getElementById("clear").addEventListener("click", clearCanvas)

// 出力
