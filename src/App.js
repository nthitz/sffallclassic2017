import React, { Component } from 'react';
import './App.css';
import moment from 'moment'
import {nest} from 'd3-collection'
import Stack from './Stack'
import players from './players.json'
import allGames from './allGames.json'

allGames.sort((a, b) => {
  return a.time - b.time
})

allGames.forEach(game => {
  game.time = moment(game.time)
})

const byGame = nest()
  .key(d => d.game)
  .entries(allGames)

console.log(byGame)

byGame.forEach((machine) => {
  const games = machine.values
  let count = 0
  const cumulativeGames = games.map(game => {
    count ++
    game.count = count
    return game
  })
  machine.cumulativeGames = cumulativeGames
})
class App extends Component {
  render() {
    return (
      <div className="App">
        <Stack data={byGame} allGames={allGames} />
      </div>
    );
  }
}

export default App;
