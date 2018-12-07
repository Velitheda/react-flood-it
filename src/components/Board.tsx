import * as React from 'react'
import './Board.css'
import {floodRegion, createBoardColours, colours} from '../GameLogic';

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
        <div className="instructions">
          <h1>Flood-It</h1>
          <p>Make the whole board the same colour by tapping/clicking on cells next to the colour in the top left corner, or by using the colour palette below.</p>
        </div>
        <div className="game">
          <button onClick={this.newBoard}>New Board</button>
          <TableBody boardColours={boardColours} onAttempt={this.onAttempt}/>
          <p className="instructions">Number of attempts: {attempts} / 25</p>
          <ColourPicker onAttempt={this.onAttempt}/>
        </div>
      </div>
    )
  }

  private newBoard = () => {
    this.setState({ boardColours: createBoardColours(this.props.size) })
    this.setState({ attempts: 0 })
  }

  private onAttempt = (colour: string) => () => {
    const result = floodRegion(colour, this.state.boardColours)
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
  onAttempt: (colour: string) => () => void
}

function TableBody ({ boardColours, onAttempt }: ITableBodyProps) {
  const body = boardColours.map((rowColours: string[], i: number) =>
    <Row colours={rowColours} key={'Row-' + i} onAttempt={onAttempt}/>
  )
  return <table className="tableBody">
    <tbody>{body}</tbody>
  </table>
}

interface IRowProps {
  colours: string[]
  onAttempt: (colour: string) => () => void
}

function Row({ colours, onAttempt }: IRowProps) {
  const rowCells = colours.map((colour: string, i: number) =>
    <ColouredCell colour={colour} key={'ColouredCell-' + i} onAttempt={onAttempt}/>
  )
  return <tr>{rowCells}</tr>
}

interface IColouredCellProps {
  colour: string
  onAttempt: (colour: string) => () => void
}

function ColouredCell({ colour, onAttempt }: IColouredCellProps) {
  return <td className={"cell " + colour}  onClick={onAttempt(colour)}></td>
}

interface IColourPickerProps {
  onAttempt: (colour: string) => () => void
}

function ColourPicker ({ onAttempt }: IColourPickerProps) {
  return <table className="colourPicker"><tbody><tr>
    {colours.map((colour) => {
      return <td className={"singleColour " + colour} onClick={onAttempt(colour)}></td>
    })}
  </tr></tbody></table>
}
