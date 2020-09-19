const ALIVE = 1
const DEAD = 0

const DEAD_SYMBOL = "  "
const ALIVE_SYMBOL = "██"

let generation = 0
let board;

setInterval(() => {
  if (generation == 0) {
    board = generateRandomSeed(150)
  }
  displayCurrentBoard(generation, board)
  board = evolve(board)
  generation++
}, 100)

function displayCurrentBoard(generation, board) {
  $('#generation').html("Generation " + generation)
  $('#board').html(stringifyBoard(board))
}

const evolve = (board) => board.map((row, rowNumber) => evolveRow(row, rowNumber, board))
const evolveRow = (row, rowNumber, board) => row.map((cell, columnNumber) => fateOfCell(cell, livingNeighbourCount(rowNumber, columnNumber, board)))

function fateOfCell(cell, livingNeighbours) {
  if (cellShouldDie(cell, livingNeighbours)) return DEAD
  if (cellShouldBeBorn(cell, livingNeighbours)) return ALIVE
  return cell
}

const cellShouldBeBorn = (cell, livingNeighbours) => cell === DEAD && livingNeighbours === 3
const cellShouldDie = (cell, livingNeighbours) => cellShouldDieDueToUnderpopulation(cell, livingNeighbours) || cellShouldDieDueToOverpopulation(cell, livingNeighbours)
const cellShouldDieDueToUnderpopulation = (cell, livingNeighbours) => cell === ALIVE && livingNeighbours < 2
const cellShouldDieDueToOverpopulation = (cell, livingNeighbours) => cell === ALIVE && livingNeighbours > 3

const livingNeighbourCount = (rowIndex, columnIndex, board)  => {
  return adjacentCount(columnIndex, board[rowIndex]) + rowAboveCount(columnIndex, rowIndex, board) + rowBelowCount(columnIndex, rowIndex, board)
}
const adjacentCount = (columnIndex, row) => countTrue(leftHandCellIsAlive(columnIndex, row), rightHandCellIsAlive(columnIndex, row))
const rowAboveCount = (columnIndex, rowIndex, board) => canCheckRowAbove(rowIndex) ? countAlongRow(columnIndex, rowIndex - 1, board) : 0
const rowBelowCount = (columnIndex, rowIndex, board) => canCheckRowBelow(rowIndex, board) ? countAlongRow(columnIndex, rowIndex + 1, board) : 0

const countAlongRow = (columnIndex, rowIndex, board) => {
  const row = board[rowIndex]
  const cell = row[columnIndex]
  return countTrue(cell === ALIVE, leftHandCellIsAlive(columnIndex, row), rightHandCellIsAlive(columnIndex, row))
}

const leftHandCellIsAlive = (columnIndex, row) => canCheckColumnLeft(columnIndex) && row[columnIndex - 1] == ALIVE
const rightHandCellIsAlive = (columnIndex, row) => canCheckColumnRight(columnIndex, row) && row[columnIndex + 1] == ALIVE

const canCheckRowAbove = (index) => index - 1 >= 0
const canCheckRowBelow = (index, board) => index + 1 < board.length
const canCheckColumnLeft = (index) => index - 1 >= 0
const canCheckColumnRight = (index, row) => index + 1 < row.length

const generateRandomSeed = size => Array(size).fill().map(() => randomRow(size))
const randomRow = size => Array(size).fill().map(() => Math.round(Math.random()))

const stringifyBoard = board => board.map(line => stringifyRow(line) + "\n")
const stringifyRow = line => line.map(cell => cell == ALIVE ? ALIVE_SYMBOL : DEAD_SYMBOL).join("")

function countTrue() {
  return Array.from(arguments).filter(it => it).length
}
