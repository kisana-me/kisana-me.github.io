// ゲームの状態を表す変数
let snake, snakeX, snakeY, snakeSize, snakeSpeed, snakeLength, direction, prevSnakeX, prevSnakeY
let foodX, foodY, foodSize, foodScore
let score, gameCount
// Canvas Sizeが600x400の時、一升20で
const gameTime = 3
const gridSize = 20
const fieldX = 30
const fieldY = 20

// Canvas要素
const canvas = document.getElementById('game-canvas')
const ctx = canvas.getContext('2d')

// ゲームを初期化する
function initGame() {
  // 初期値を設定する
  snake = []
  snakeX = fieldX / 2
  snakeY = fieldY / 2
  snakeSize = 1
  snakeSpeed = 1
  snakeLength = 1
  direction = 'right'

  foodSize = 1
  foodScore = 10

  score = 0
  gameCount = 0

  // 初期の食べ物を生成する
  spawnFood()
}

// 食べ物をランダムな位置に生成する
function spawnFood() {
  foodX = Math.floor(Math.random() * (fieldX - foodSize))
  foodY = Math.floor(Math.random() * (fieldY - foodSize))
}

// ゲームの状態を更新する
function updateGameState() {
  // 蛇の位置を更新する
  let newHead = {'x': snakeX, 'y': snakeY};
  prevSnakeX = snakeX
  prevSnakeY = snakeY
  switch (direction) {
    case 'left':
      snakeX -= snakeSpeed
      newHead.x = snakeX
      break
    case 'up':
      snakeY -= snakeSpeed
      newHead.y = snakeY
      break
    case 'right':
      snakeX += snakeSpeed
      newHead.x = snakeX
      break
    case 'down':
      snakeY += snakeSpeed
      newHead.y = snakeY
      break
  }
  snake.unshift(newHead)
  snake.splice(snakeLength+1, 1)
  // .width || .heightで取得することができるため、比較する。
  

  // 食べ物に当たったらスコアを加算する
}

//
function checkWall() {
  if (snakeX < 0 || snakeX + snakeSize > fieldX) {
    return true
  }
  if (snakeY < 0 || snakeY + snakeSize > fieldY) {
    return true
  }
  return false
}

// 蛇の頭と体の位置を比較して、ゲームオーバーの条件を判定する関数
function checkCollision() {
  for (let i = 1; i < snake.length; i++) {
    if (snakeX === snake[i].x && snakeY === snake[i].y) {
      return true; // 頭が体に衝突した場合、trueを返す
    }
  }
  return false;
}

// ゲームを描画する
function renderGame() {
  // 画面をクリアする
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  //console.log(`nowX: ${snakeX} nowY: ${snakeY} prevX: ${snake[snakeLength - 1].x} prevY: ${snake[snakeLength - 1].y}`)
  // 蛇を描画する
  for (let i = 0; i < snakeLength; i++) {
    if (i === 0) {
      ctx.fillStyle = 'red'
      ctx.fillRect(snakeX * gridSize, snakeY * gridSize, snakeSize * gridSize, snakeSize * gridSize)
      const arrowSize = snakeSize * gridSize / 2;
      const arrowX = snakeX * gridSize + snakeSize * gridSize / 2;
      const arrowY = snakeY * gridSize + snakeSize * gridSize / 2;
      switch (direction) {
        case 'up':
          drawArrow(arrowX, arrowY, arrowSize, 'up');
          break;
        case 'down':
          drawArrow(arrowX, arrowY, arrowSize, 'down');
          break;
        case 'left':
          drawArrow(arrowX, arrowY, arrowSize, 'left');
          break;
        case 'right':
          drawArrow(arrowX, arrowY, arrowSize, 'right');
          break;
      }
    } else {
      ctx.fillStyle = 'green'
      ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, snakeSize * gridSize, snakeSize * gridSize)
    }
  }

  // 食べ物を描画する
  ctx.font = `${foodSize * gridSize}px sans-serif`
  ctx.fillText('\uD83C\uDF4E', foodX * gridSize, foodY * gridSize + foodSize * gridSize)

  // スコアを表示する
  ctx.fillStyle = 'black'
  ctx.font = '20px Arial'
  ctx.fillText(`Score: ${score}/ GameCount: ${gameCount}`, 10, 30)
}

// 矢印を描画する関数
function drawArrow(x, y, size, direction) {
  const arrowPath = new Path2D();
  const arrowHalfSize = size / 2;

  switch (direction) {
    case 'up':
      arrowPath.moveTo(x, y - arrowHalfSize);
      arrowPath.lineTo(x - arrowHalfSize, y + arrowHalfSize);
      arrowPath.lineTo(x + arrowHalfSize, y + arrowHalfSize);
      break;
    case 'down':
      arrowPath.moveTo(x, y + arrowHalfSize);
      arrowPath.lineTo(x - arrowHalfSize, y - arrowHalfSize);
      arrowPath.lineTo(x + arrowHalfSize, y - arrowHalfSize);
      break;
    case 'left':
      arrowPath.moveTo(x - arrowHalfSize, y);
      arrowPath.lineTo(x + arrowHalfSize, y - arrowHalfSize);
      arrowPath.lineTo(x + arrowHalfSize, y + arrowHalfSize);
      break;
    case 'right':
      arrowPath.moveTo(x + arrowHalfSize, y);
      arrowPath.lineTo(x - arrowHalfSize, y - arrowHalfSize);
      arrowPath.lineTo(x - arrowHalfSize, y + arrowHalfSize);
      break;
  }

  ctx.fillStyle = 'white';
  ctx.fill(arrowPath);
}

// ゲームオーバー時に呼び出される
function gameOver() {
  alert(`Game Over! Your score is ${score}`)
  initGame()
}

// ゲームループ
function gameLoop() {
  gameCount += 1
  updateGameState()
  renderGame()
  // if check => init
  opField()
}

// ゲームを開始する
// ゲーム開始ボタンのクリックイベント
let intervalID
document.getElementById('start-button').addEventListener('click', function() {
  initGame()
  gameLoop()
  intervalID = setInterval(gameLoop, 1000 / gameTime)
})

// 一時中断ボタンのクリックイベント
document.getElementById('pause-button').addEventListener('click', function() {
  clearInterval(intervalID)
})

document.getElementById('resume-button').addEventListener('click', function() {
  intervalID = setInterval(gameLoop, 1000 / gameTime)
})

// キーボードの入力を受け取る
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 37: // 左キー
      if (direction !== 'right') {
        direction = 'left'
      }
      break
    case 38: // 上キー
      if (direction !== 'down') {
        direction = 'up'
      }
      break
    case 39: // 右キー
      if (direction !== 'left') {
        direction = 'right'
      }
      break
    case 40: // 下キー
      if (direction !== 'up') {
        direction = 'down'
      }
      break
  }
})
function changeDirection(newDirection) {
  switch (newDirection) {
    case 'left':
      if (direction !== 'right') {
        direction = 'left';
      }
      break;
    case 'up':
      if (direction !== 'down') {
        direction = 'up';
      }
      break;
    case 'right':
      if (direction !== 'left') {
        direction = 'right';
      }
      break;
    case 'down':
      if (direction !== 'up') {
        direction = 'down';
      }
      break;
  }
}

////////////////
//     AI     //
////////////////
// 入力は頭の向き4つ、食べ物までの距離XYで2つ、近くの壁までの距離XYで2つ、計8つで
// 出力は次の頭の向き4つで
// 出力のゲーム結果から報酬関数より報酬が与えられます。
// 壁衝突で0、食べ物までの近さで0~1、食べ物衝突で1の報酬が与えられます。
// NNに状態、結果、報酬を与える
// next = connectNN(reward, direction, dist[0], dist[1], distanceToWall.x, distanceToWall.y)
// nextの内容でdirectionを変更
function distance(x1, y1, x2, y2) {
  const dx = x1 - x2
  const dy = y1 - y2
  return [Math.sqrt(dx*dx), Math.sqrt(dy*dy), Math.sqrt(dx * dx + dy * dy)]
}
function getDistanceToWall(snakeX, snakeY, fieldX, fieldY) {
  // x座標において最も近い壁までの距離を計算する
  const distanceToLeftWall = snakeX
  const distanceToRightWall = fieldX - snakeX - 1
  const distanceToHorizontalWall = Math.min(distanceToLeftWall, distanceToRightWall)

  // y座標において最も近い壁までの距離を計算する
  const distanceToTopWall = snakeY
  const distanceToBottomWall = fieldY - snakeY - 1
  const distanceToVerticalWall = Math.min(distanceToTopWall, distanceToBottomWall)

  // x座標とy座標の距離のうち、最も近い壁までの距離を返す
  return {
    x: distanceToHorizontalWall,
    y: distanceToVerticalWall
  }
}
/*
function opField(){
  const dist = distance(snakeX, snakeY, foodX, foodY)
  console.log(`食べ物までxは${dist[0]}、yは${dist[1]}、xyは${dist[2]}です。`)
  const distanceToWall = getDistanceToWall(snakeX, snakeY, fieldX, fieldY)
  console.log(`壁までは${distanceToWall.x}と${distanceToWall.y}`)
  const prevDist = distance(prevSnakeX, prevSnakeY, foodX, foodY)
  if(dist[0] < prevDist[0]) {
    // x近くなった
  } else if (dist[1] < prevDist[1]) {
    // y近くなった
  }
  let reward
  if (checkCollision()) {
    initGame()
    reward = 0.00001
  } else if(checkWall()) {
    initGame()
    reward = 0
  } else {
    reward = 1/dist[2]
  }
  console.log(reward)
}
*/

function createFieldArray(fieldX, fieldY, snakeX, snakeY, foodX, foodY) {
  const fieldArray = new Array(fieldX * fieldY).fill(0);

  const snakeHeadIndex = snakeY * fieldX + snakeX;
  fieldArray[snakeHeadIndex] = 0.1;

  const foodIndex = foodY * fieldX + foodX;
  fieldArray[foodIndex] = 1;

  return fieldArray;
}
