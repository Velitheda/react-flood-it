
import * as React from 'react';
import * as enzyme from 'enzyme';
import Board from '../components/Board';

it('renders the title of the game', () => {
  const board = enzyme.shallow(<Board size={2} />);
  expect(board.find(".board h1").text()).toEqual('Flood-It')
});
