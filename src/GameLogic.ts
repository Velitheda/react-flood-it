
function isValidColour(colour: string, board: string[][], floodedRegion: Cell[]): boolean {

  const seedColour = board[0][0]
  if (colour === seedColour) {
    return false
  }
  const colourAdjacentToFloodedRegion = board.filter((row, rowIndex) => row.filter((cell, columnIndex) => {
    return board[rowIndex][columnIndex] === colour && isCellAdjacentToFloodedRegion(new Cell(rowIndex, columnIndex), floodedRegion)
  }).length > 0).length > 0
  return colourAdjacentToFloodedRegion
}

// function getNeighborCells(cell: Cell) {
//   const { row, column } = cell
//   return [
//     new Cell(row + 1, column),
//     new Cell(row - 1, column),
//     new Cell(row, column + 1),
//     new Cell(row, column - 1)
//   ]
// }

function isCellAdjacentToFloodedRegion(cell: Cell, floodedRegion: Cell[]): boolean {
  const { row, column } = cell
  return floodedRegion.map((floodedCell: Cell) => {
    const {  row: floodedRow, column: floodedColumn } = floodedCell
    if( row + 1 === floodedRow && column === floodedColumn) {
      return true
    } else if ( row - 1 === floodedRow && column === floodedColumn ) {
      return true
    } else if ( row === floodedRow && column + 1 === floodedColumn ) {
      return true
    } else if ( row === floodedRow && column - 1 === floodedColumn ) {
      return true
    } else {
      return false
    }
  }).find((value) => value === true) || false
}

function getFloodedRegion(board: string[][]): Cell[] {
  const seedColour = board[0][0]
  return getRegion(board, seedColour, 0, 0, [])
}

export function getRegion(board: string[][], colour: string, row: number, column: number, result: Cell[]): Cell[] {

  const outOfBounds = !(board[row] && board[row][column])
  const differentColour = outOfBounds || (board[row][column] !== colour)
  const alreadyAdded = result.filter((cell) => cell.equals(new Cell(row, column))).length > 0

  if( outOfBounds || differentColour || alreadyAdded ) {
    return result
  }

  result.push(new Cell(row, column))
  const bottomCells = getRegion(board, colour, row + 1, column, result)
  const topCells = getRegion(board, colour, row - 1, column, result)
  const rightCells = getRegion(board, colour, row, column + 1, result)
  const leftCells = getRegion(board, colour, row, column - 1, result)

  const nonDistinct = result.concat(rightCells).concat(leftCells).concat(topCells).concat(bottomCells)
  return nonDistinct.filter((cell, index, array) => array.indexOf(cell) === index)
}

export class Cell {
  row: number
  column: number
  constructor(row: number, column: number) {
    this.row = row
    this.column = column
  }

  equals(other: Cell): boolean {
    return this.row === other.row && this.column === other.column
  }
}

export function floodRegion(clickedColour: string, board: string[][]): [string[][], boolean] {
  if(isBoardFlooded(board)) {
    return [board, false]
  }
  const floodedRegion = getFloodedRegion(board)
  if(!isValidColour(clickedColour, board, floodedRegion)) {
    return [board, false]
  }
  const newColour = clickedColour
  const newBoard = board.map((row: string[], rowIndex: number) => {
    return row.map((colour: string, columnIndex: number) => {
      const currentCell = new Cell(rowIndex, columnIndex)
      const inFloodedRegion = floodedRegion.filter((cell) => cell.equals(currentCell)).length > 0
      if (inFloodedRegion) {
        return newColour
      } else {
        return board[rowIndex][columnIndex]
      }
    })
  })
  return [newBoard, true]
}

export function isBoardFlooded(board: string[][]): boolean {
  const totalCells = board[0].length * board[0].length

  const won = colours.map((colour) => {
    const winningBoard = board.reduce((winningColours, row) => {
      const filteredRow = row.filter((cellColour) => cellColour === colour)
      return winningColours.concat(filteredRow)
    }, [])
    return winningBoard.length === totalCells
  })
  return won.filter((hasWon) => hasWon).length > 0
}

export const createBoardColours: (size: number) => string[][] = (size) =>
  Array(size).fill('').map(() => boardRow(size))

const boardRow = (size: number) => Array(size).fill('').map(() => randomColour())

const randomColour = () => colours[randomIntFromInterval(0, colours.length - 1)]

const randomIntFromInterval = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const colours = ['colour1', 'colour2', 'colour3', 'colour4', 'colour5', 'colour6']
