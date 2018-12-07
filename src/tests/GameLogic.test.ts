
//import * as React from 'react';
import {floodRegion, getRegion, isBoardFlooded, Cell} from '../GameLogic';

it('floods the region', () => {
  const board = [['blue', 'green'], ['purple', 'red']]
  const result = [['green', 'green'], ['purple', 'red']]
  expect(floodRegion('green', board)[0]).toEqual(result)
});

it('does not flood when the target colour is not next to the flooded region', () => {
  const board = [['blue', 'green'], ['purple', 'red']]
  expect(floodRegion('red', board)[0]).toEqual(board)
});

it('floods the region when the target colour belongs to a region touching the flooded region', () => {
  const board = [['blue', 'green'], ['purple', 'green']]
  const result = [['green', 'green'], ['purple', 'green']]
  expect(floodRegion('green', board)[0]).toEqual(result)
});

it('floods the region when colour clicked is further away from seed cell', () => {
  const board = [['blue', 'green'], ['blue', 'red'], ['purple', 'red']]
  const result = [['purple', 'green'], ['purple', 'red'],  ['purple', 'red']]
  expect(floodRegion('purple', board)[0]).toEqual(result)
});

it('does not create a valid move if user selects colour from flooded region', () => {
  const board = [['blue', 'green'], ['blue', 'red']]
  expect(floodRegion('blue', board)[1]).toEqual(false)
});

it('selects the flooded region', () => {
  const board = [
    ['blue', 'blue'],
    ['purple', 'red']
  ]
  expect(getRegion(board, 'blue', 0, 1, [])).toEqual(expect.arrayContaining([new Cell(0, 0), new Cell(0, 1)])
});

it('selects the flooded region with cells not adjacent to seed cell', () => {
  const board = [
    ['blue', 'blue'],
    ['blue', 'blue']
  ]
  expect(getRegion(board, 'blue', 0, 1, [])).toEqual(expect.arrayContaining([
    new Cell(0, 0),
    new Cell(1, 0),
    new Cell(0, 1),
    new Cell(1, 1)
  ]))
});

it('detects if the board is all the same colour', () => {
  const board = [
    ['colour1', 'colour1', 'colour1'],
    ['colour1', 'colour1', 'colour1'],
    ['colour1', 'colour1', 'colour1']
  ]
  expect(isBoardFlooded(board)).toEqual(true)
});

it('detects if the board is not the same colour', () => {
  const board = [
    ['colour1', 'colour1'],
    ['colour1', 'colour2']
  ]
  expect(isBoardFlooded(board)).toEqual(false)
});
