import { BOARD_HEIGHT, BOARD_WIDTH, BLOCK_SIZE, FRAME_TIME, board, createBoard } from "./constants"
import { getRandomFigure, checkYCollition, checkXCollition, rotatePiece } from "./utils"
import { setPaused, paused, gameOver, setGameOver } from "./gameStates"

let piece
let time
let context

function start() {

  createBoard()

  const canvas = document.querySelector('canvas')
  context = canvas.getContext('2d')

  // Initializing piece and its position
  piece = getRandomFigure()
  time = 0

  canvas.width = BLOCK_SIZE * BOARD_WIDTH
  canvas.height = BLOCK_SIZE * BOARD_HEIGHT

  context.scale(BLOCK_SIZE, BLOCK_SIZE)

  // Color de las piezas
  context.fillStyle = "yellow"
}


function update() {

  if (gameOver) {
    document.querySelector('#gameover-menu').style.display = 'flex'
  }

  if (!paused && !gameOver) {
    time++

    if (time > FRAME_TIME) {
      handleArrowPress(piece, "ArrowDown")
      time = 0
    }

    if (checkYCollition(piece)) piece = getRandomFigure()
    draw()

    window.requestAnimationFrame(update)
  }
}


function draw() {

  board.forEach((row, y) => {
    row.forEach((square, x) => {

      if (square === 1) {

        context.fillStyle = piece.color
        context.fillRect(x, y, 1, 1)

      } else if (square === 0) {

        context.fillStyle = "black"
        context.fillRect(x, y, 1, 1)
      }
    }
    )
  })
}


document.addEventListener('keydown', (event) => {
  const key = event.key;
  handleArrowPress(piece, key)
});

function handleArrowPress(piece, action) {

  // Reset squares
  piece.forEach((row, y) => row.forEach((_, x) => {
    board[y + piece.position[1]][x + piece.position[0]] = 0
  }))

  switch (action) {
    case "ArrowLeft":

      if (!checkXCollition(piece, "left"))
        piece.position[0]--
      break;

    case "ArrowRight":

      if (!checkXCollition(piece, "right"))
        piece.position[0]++
      break;

    case "ArrowDown":
      piece.position[1]++
      break;

    case "ArrowUp":

      piece = rotatePiece(piece)
      break;
  }

  piece.forEach((row, y) => row.forEach((square, x) => {
    if (square === 1) board[y + piece.position[1]][x + piece.position[0]] = 1
  }))
}



document.querySelector('#pause-btn').addEventListener('click', (e) => {

  setPaused(!paused)
  const pauseMenu = document.querySelector('#pause-menu')

  if (paused) pauseMenu.style.display = 'flex'
  else {
    pauseMenu.style.display = 'none'
    update()
  }
})

document.querySelector('#reset-btn').addEventListener('click', (e) => {

  setGameOver(true)
})

document.querySelector('#play-again-btn').addEventListener('click', (e) => {

  setGameOver(false)
  const gameOverMenu = document.querySelector('#gameover-menu')

  gameOverMenu.style.display = 'none'

  piece.position[1] = 0
  
  createBoard()
  update()
})

start()
update()
