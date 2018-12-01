
//import * as React from 'react';
import {floodRegion, getRegion, hasWon, Cell} from '../GameLogic';

it('floods the region', () => {
  const board = [['blue', 'green'], ['purple', 'red']]
  const result = [['green', 'green'], ['purple', 'red']]
  expect(floodRegion(new Cell(0,1), board)).toEqual(result)
});

it('does not flood when the target cell is not next to the flooded region', () => {
  const board = [['blue', 'green'], ['purple', 'red']]
  expect(floodRegion(new Cell(1,1), board)).toEqual(board)
});

it('floods the region when cell clicked is further away from seed cell', () => {
  const board = [['blue', 'green'], ['blue', 'red'], ['purple', 'red']]
  const result = [['purple', 'green'], ['purple', 'red'],  ['purple', 'red']]
  expect(floodRegion(new Cell(2,0), board)).toEqual(result)
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
    ['blue', 'blue'],
    ['blue', 'blue']
  ]
  expect(hasWon(board)).toEqual(true)
});

it('detects if the board is not the same colour', () => {
  const board = [
    ['blue', 'blue'],
    ['blue', 'green']
  ]
  expect(hasWon(board)).toEqual(false)
});