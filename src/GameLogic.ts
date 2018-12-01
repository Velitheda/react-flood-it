function isValidClick(clickedCell: Cell, board: string[][], floodedRegion: Cell[]): boolean {
  const {row, column} = clickedCell
  const clickedRegion = getRegion(board, board[row][column], row, column, [])

  const neighborCells = clickedRegion.reduce(
    (allNeighbors: Cell[], cell: Cell) => allNeighbors.concat(getNeighborCells(cell)), []
  )
  const contains = floodedRegion.filter((cell) =>
    neighborCells.filter((neighborCell) => neighborCell.equals(cell)).length > 0
  )
  return contains.length > 0
}

function getNeighborCells(cell: Cell) {
  const { row, column } = cell
  return [
    new Cell(row + 1, column),
    new Cell(row - 1, column),
    new Cell(row, column + 1),
    new Cell(row, column - 1)
  ]
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

export function floodRegion(clickedCell: Cell, board: string[][]): string[][] {
  const floodedRegion = getFloodedRegion(board)
  if(!isValidClick(clickedCell, board, floodedRegion)) {
    return board
  }
  const newColour = board[clickedCell.row][clickedCell.column]
  return board.map((row: string[], rowIndex: number) => {
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
}

export function hasWon(board: string[][]): boolean {
  const won = colours.map((colour) => {
    return board.filter((row) => {
      return row.filter((cellColour) => colour === cellColour)
    })
  })
  console.log(won)
  return true
}

// function createInitialColours(): string[][] {
//   return []
// }

const colours = ['red', 'blue', 'green', 'yellow', 'purple', 'pink']
