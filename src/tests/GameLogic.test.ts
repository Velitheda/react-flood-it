import { Map } from 'immutable'
import { floodRegion, getRegion, colours, isBoardFlooded, Cell, createBoardColours, hashKey, unhashKey } from '../GameLogic';

it('hashes a cell key correctly', () => {
  const hashedKey = hashKey(10, 3)
  expect(hashedKey).toEqual('r10c3')
})

it('restores a hashed a cell key', () => {
  expect(unhashKey('r10c3')).toEqual(new Cell(10, 3))
})

it('floods the region', () => {
  const board = Map({
    [hashKey(0,0)]: colours[0], [hashKey(0,1)]: colours[1],
    [hashKey(1,0)]: colours[2], [hashKey(1,1)]: colours[3]
  })
  const result: Map<string, string> = Map({
    [hashKey(0,0)]: colours[1], [hashKey(0,1)]: colours[1],
    [hashKey(1,0)]: colours[2], [hashKey(1,1)]: colours[3]
  })
  expect(floodRegion(colours[1], board)[0]).toEqual(result)
});

it('does not flood when the target colour is not next to the flooded region', () => {
  const board: Map<string, string> = Map({
    [hashKey(0,0)]: colours[0], [hashKey(0,1)]: colours[1],
    [hashKey(1,0)]: colours[2], [hashKey(1,1)]: colours[3]
  })
  expect(floodRegion(colours[3], board)[0]).toEqual(board)
});

it('floods the region when the target colour belongs to a region touching the flooded region', () => {
  const board: Map<string, string> = Map({
    [hashKey(0,0)]: colours[0], [hashKey(0,1)]: colours[1],
    [hashKey(1,0)]: colours[2], [hashKey(1,1)]: colours[1]
  })
  const result: Map<string, string> = Map({
    [hashKey(0,0)]: colours[1], [hashKey(0,1)]: colours[1],
    [hashKey(1,0)]: colours[2], [hashKey(1,1)]: colours[1]
  })
  expect(floodRegion(colours[1], board)[0]).toEqual(result)
});

it('floods the region when colour selected is further away from seed cell', () => {
  const board: Map<string, string> = Map({
    [hashKey(0,0)]: colours[0], [hashKey(0,1)]: colours[1],
    [hashKey(1,0)]: colours[0], [hashKey(1,1)]: colours[1],
    [hashKey(2,0)]: colours[2], [hashKey(2,1)]: colours[3]
  })
  const result: Map<string, string> = Map({
    [hashKey(0,0)]: colours[2], [hashKey(0,1)]: colours[1],
    [hashKey(1,0)]: colours[2], [hashKey(1,1)]: colours[1],
    [hashKey(2,0)]: colours[2], [hashKey(2,1)]: colours[3]
  })
  expect(floodRegion(colours[2], board)[0]).toEqual(result)
});

it('does not create a valid move if user selects colour from flooded region', () => {
  const board: Map<string, string> = Map({
    [hashKey(0,0)]: colours[0], [hashKey(0,1)]: colours[1],
    [hashKey(1,0)]: colours[1], [hashKey(1,1)]: colours[3]
  })
  expect(floodRegion(colours[0], board)[1]).toEqual(false)
});

it('selects the flooded region', () => {
  const board: Map<string, string> = Map({
    [hashKey(0,0)]: colours[0], [hashKey(0,1)]: colours[0],
    [hashKey(1,0)]: colours[2], [hashKey(1,1)]: colours[3]
  })
  expect(getRegion(board, colours[0], 0, 1, [])).toEqual(
    expect.arrayContaining([new Cell(0, 0), new Cell(0, 1)]))
});

it('selects the flooded region with cells not adjacent to seed cell', () => {
  const board: Map<string, string> = Map({
    [hashKey(0,0)]: colours[0], [hashKey(0,1)]: colours[0],
    [hashKey(1,0)]: colours[0], [hashKey(1,1)]: colours[0]
  })
  expect(getRegion(board, colours[0], 1, 1,[]))
    .toEqual(expect.arrayContaining([
      new Cell(0, 0), new Cell(1, 0),
      new Cell(0, 1), new Cell(1, 1)
    ]))
});

it('detects if the board is all the same colour', () => {
  const board: Map<string, string> = Map({
    [hashKey(0,0)]: colours[0], [hashKey(0,1)]: colours[0],
    [hashKey(1,0)]: colours[0], [hashKey(1,1)]: colours[0],
    [hashKey(2,0)]: colours[0], [hashKey(2,1)]: colours[0]
  })
  expect(isBoardFlooded(board)).toEqual(true)
});

it('detects if the board is not the same colour', () => {
  const board: Map<string, string> = Map({
    [hashKey(0,0)]: colours[0], [hashKey(0,1)]: colours[0],
    [hashKey(1,0)]: colours[0], [hashKey(1,1)]: colours[1]
  })
  expect(isBoardFlooded(board)).toEqual(false)
});

it('creates an intial board', () => {
  // This test currently fails because I'm not seeding the board yet
  const result: Map<string, string> = Map({
      [hashKey(0,0)]: colours[1], [hashKey(0,1)]: colours[1],
      [hashKey(1,0)]: colours[2], [hashKey(1,1)]: colours[1]
    })
  expect(createBoardColours(2)).toEqual(result)
});
