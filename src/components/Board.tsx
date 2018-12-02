import * as React from 'react'
import './Board.css'
import {floodRegion, colours, Cell} from '../GameLogic';

export interface IBoardProps {
  size: number
}

interface IBoardState {
  attempts: number
  boardColours: string[][]
}

class Board extends React.Component<IBoardProps, IBoardState> {
  constructor(props: IBoardProps) {
    super(props)

    this.state = {
      attempts: 0,
      boardColours: createBoardColours(props.size)
     }
  }

  public render() {
    const { attempts, boardColours } = this.state
    return (
      <div className="board">
        <div>
          <h1>Flood-It</h1>
          <p>Make the whole board the same colour by clicking on cells next to the colour in the top left corner.</p>
        </div>

        <TableBody boardColours={boardColours} onAttempt={this.onAttempt}/>

        <p>Number of attempts: {attempts} / 25</p>
      </div>
    )
  }

  private onAttempt = (row: number, column: number) => () => {
    const result = floodRegion(new Cell(row, column), this.state.boardColours)
    const succesfulAttempt = result[1]
    if(succesfulAttempt) {
      this.setState({ boardColours: result[0] })
      this.setState({ attempts: this.state.attempts + 1 })
    }

  }
}

export default Board;

interface ITableBodyProps {
  boardColours: string[][],
  onAttempt: (row: number, column: number) => () => void
}

function TableBody ({ boardColours, onAttempt }: ITableBodyProps) {
  const body = boardColours.map((rowColours: string[], i: number) =>
    <Row colours={rowColours} key={'Row-' + i} row={i} onAttempt={onAttempt}/>
  )
  return <table>
    <tbody>{body}</tbody>
  </table>
}

interface IRowProps {
  colours: string[]
  row: number
  onAttempt: (row: number, column: number) => () => void
}

function Row({ colours, row, onAttempt }: IRowProps) {
  const rowCells = colours.map((colour: string, i: number) =>
    <ColouredCell colour={colour} key={'ColouredCell-' + i} row={row} column={i} onAttempt={onAttempt}/>
  )
  return <tr>{rowCells}</tr>
}

interface IColouredCellProps {
  colour: string
  row: number
  column: number
  onAttempt: (row: number, column: number) => () => void
}

function ColouredCell({ colour, row, column, onAttempt }: IColouredCellProps) {
  const style = {
    backgroundColor: colour
  }
  return <td className="cell" style={style} onClick={onAttempt(row, column)}></td>
}

// helpers
const createBoardColours: (size: number) => string[][] = (size) =>
  Array(size).fill('').map(() => boardRow(size))

const boardRow = (size: number) => Array(size).fill('').map(() => randomColour())

const randomColour = () => colours[randomIntFromInterval(0, colours.length - 1)]

const randomIntFromInterval = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)
