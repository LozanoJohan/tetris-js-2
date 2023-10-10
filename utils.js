import { PIECES, BOARD_WIDTH, board, AVAIABLE_COLORS } from "./constants"
import { setGameOver, piece } from "./gameStates"

const getRandomStartingPos = (board_width) => Math.floor(Math.random() * (board_width - 2) + 1)
const getRandomColor = () => AVAIABLE_COLORS[Math.floor(Math.random() * AVAIABLE_COLORS.length)]

export const getRandomFigure = () => {

    const piece = PIECES[Math.floor(Math.random() * PIECES.length)]
    const startingX = getRandomStartingPos(BOARD_WIDTH)

    piece.position = [startingX, 0]
    piece.color = getRandomColor()

    return piece
}

export const checkYCollition = () => {

    const currentPos = piece.position
    let collided = false

    piece[piece.length - 1].forEach((_, xIndex) => {

        const lastRowPiece = board[currentPos[1] + piece.length - 1]
        const rowAhead = board[currentPos[1] + piece.length]

        let blockToCheck = 0
        if (rowAhead) blockToCheck = rowAhead[currentPos[0] + xIndex]

        if (blockToCheck === 1 && lastRowPiece[currentPos[0] + xIndex] !== 0) {

            collided = true

            piece.forEach((row, y) => {

                const landedRowsIndex = currentPos[1] + y
                if (!checkRowDelete(landedRowsIndex) && landedRowsIndex < 2)
                    setGameOver(true)
            })
        }
    })
    return collided
}

export const checkXCollition = (direction) => {

    const currentPos = piece.position
    let collided = false

    const colIndexes = []

    piece.forEach((_, yIndex) => {

        colIndexes.push(yIndex + currentPos[1])
    })

    colIndexes.forEach(index => {

        const rowToCheck = board[index]
        const xIndex = direction === "right" ? currentPos[0] + piece[0].length : currentPos[0] - 1

        if (rowToCheck[xIndex] === 1 /*&& rowToCheck[currentPos[0]] === 1*/) {
            collided = true
        }
    })

    return collided
}

const checkRowDelete = (index) => {

    if (board[index].every(square => square === 1)) {
        board[index] = new Array(BOARD_WIDTH).fill(0)

        return true
    }
    return false
}

export const rotatePiece = () => {

    // Reset squares
    piece.forEach((row, y) => row.forEach((_, x) => {
        board[y + piece.position[1]][x + piece.position[0]] = 0
    }))

    const newPiece = []
    // ESTO ES LO MÁS COMPLICADO DE LEJOS
    for (let i = 0; i < piece[0].length; i++) {
        const row = []

        for (let j = piece.length - 1; j >= 0; j--) {
            row.push(piece[j][i])
        }

        newPiece.push(row)

        newPiece.position = piece.position
        newPiece.color = piece.color
    }
    return newPiece
}
