import { List, Map, Range } from 'immutable'

function isValidColour(colour: string, board: Map<string, string>, floodedRegion: Cell[]): boolean {

  const seedColour = board.get('r0c0')
  if (colour === seedColour) {
    return false
  }
  return board.some((value, key, _) => {
    return (board.get(key) === colour) && isCellAdjacentToFloodedRegion(unhashKey(key), floodedRegion)
  })
}

function getNeighborCells(cell: Cell): Cell[] {
  const { row, column } = cell
  return [
    new Cell(row + 1, column),
    new Cell(row - 1, column),
    new Cell(row, column + 1),
    new Cell(row, column - 1)
  ]
}

function isCellAdjacentToFloodedRegion(cell: Cell, floodedRegion: Cell[]): boolean {
  return floodedRegion.some((floodedCell: Cell) => {
    return getNeighborCells(floodedCell).filter((neighbor) => neighbor.equals(cell)).length > 0
  })
}

function getFloodedRegion(board: Map<string, string>): Cell[] {
  const seedColour = board.get('r0c0') || ''
  return getRegion(board, seedColour, 0, 0, [])
}

export function getRegion(board: Map<string, string>, colour: string, row: number, column: number, result: Cell[]): Cell[] {
  // refactor into another 'isvalid' method
  const outOfBounds = !board.has(hashKey(row, column))
  const differentColour = outOfBounds || (board.get(hashKey(row, column)) !== colour)
  const alreadyAdded = !!result.find((cell) => cell.equals(new Cell(row, column)))
  //
  if( outOfBounds || differentColour || alreadyAdded ) {
    return result
  }
  result.push(new Cell(row, column))

//neighborCells.map
  const bottomCells = getRegion(board, colour, row + 1, column, result)
  const topCells = getRegion(board, colour, row - 1, column, result)
  const rightCells = getRegion(board, colour, row, column + 1, result)
  const leftCells = getRegion(board, colour, row, column - 1, result)

// create a 'merge and filter' method
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

export function floodRegion(clickedColour: string, board: Map<string, string>): [Map<string, string>, boolean] {
  if(isBoardFlooded(board)) {
    return [board, false]
  }
  const floodedRegion: Cell[] = getFloodedRegion(board)
  if(!isValidColour(clickedColour, board, floodedRegion)) {
    return [board, false]
  }
  const newBoard = board.map((value: string, key: string) => {
    const currentCell = unhashKey(key)
    const inFloodedRegion = floodedRegion.filter((cell) =>
      cell.equals(currentCell)).length > 0
    if (inFloodedRegion) {
      return clickedColour
    } else {
      return value
    }
  })
  return [newBoard, true]
}

export function isBoardFlooded(board: Map<string, string>): boolean {
  return coloursList.some((colour) =>
    board.valueSeq().every((cellColour) => cellColour === colour)
  )
}

/*
hashing map keys
 */
export function hashKey (row: number, column: number): string {
  return 'r' + row + 'c' + column
}

export function hashKeyCell (cell: Cell): string {
  const { row, column } = cell
  return hashKey(row, column)
}

export function unhashKey (key: string): Cell {
  const matched = key.match(/r(\d+)c(\d+)/) || []
  return new Cell(Number.parseInt(matched[1] || '-1'), Number.parseInt( matched[2] || '-1'))
}

/*
creating the board
 */

 export const createBoardColours: (size: number) => Map<string, string> = (size) => {
   const mapBody: string[][] = Range(0, size).flatMap((i) =>
      Range(0, size).map((j) =>
      [hashKey(i, j), randomColour()]
   )).toArray()
// Typescript needs some help with the type here in order to create the Map properly
   return Map(mapBody.map(kv => [kv[0], kv[1]] as [string, string]))
 }

const randomColour: () => string = () => colours[randomIntFromInterval(0, colours.length - 1)]

const randomIntFromInterval = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const colours: string[] = ['colour1', 'colour2', 'colour3', 'colour4', 'colour5', 'colour6']

const coloursList: List<string> = List(colours)
