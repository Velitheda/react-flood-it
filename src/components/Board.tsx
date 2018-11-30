import * as React from 'react'
import './Board.css'

const colours = ['red', 'blue', 'green', 'yellow', 'purple', 'pink']

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
      boardColours: boardColours(props.size)
     }
  }

  public render() {
    const { attempts, boardColours } = this.state

    return (
      <div className="board">
        <div>
          <h1>Flood-It</h1>
          <p>Make the whole board the same colour</p>
        </div>

        <TableBody boardColours={boardColours} />

        <p>Number of attempts: {attempts}</p>

        <button onClick={this.onDecrement}>-</button>
        <button onClick={this.onIncrement}>+</button>

      </div>
    )
  }

  private onIncrement = () => this.updateAttempts(this.state.attempts + 1);
  private onDecrement = () => this.updateAttempts(this.state.attempts - 1);

  private updateAttempts(attempts: number) {
    this.setState({ attempts });
  }
}

export default Board;

interface ITableBodyProps {
  boardColours: string[][],
}

function TableBody ({ boardColours }: ITableBodyProps) {
  const body = boardColours.map((rowColours: string[], i: number) =>
    <Row colours={rowColours} key={'Row-' + i}/>
  )
  return <table>
    <tbody>{body}</tbody>
  </table>
}

interface IRowProps {
  colours: string[],
}

function Row({ colours }: IRowProps) {
  const rowCells = colours.map((colour: string, i: number) =>
    <ColouredCell colour={colour} key={'ColouredCell-' + i}/>
  )
  return <tr>{rowCells}</tr>
}

interface IColouredCellProps {
  colour: string
}

function ColouredCell({ colour }: IColouredCellProps) {
  const style = {
    backgroundColor: colour
  }
  return <td className="cell" style={style}></td>
}

// helpers
const boardColours: (size: number) => string[][] = (size) =>
  Array(size).fill('').map(() => boardRow(size))

const boardRow = (size: number) => Array(size).fill('').map(() => randomColour())

const randomColour = () => colours[randomIntFromInterval(0, colours.length)]

const randomIntFromInterval = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)
