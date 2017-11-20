const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const moment = require('moment')


const tzOffset = 3

const players = require('./players.json')

getNextPlayer()
const allGames = []
function getNextPlayer() {
  if (players.length === 0) {
    return done()
  }
  const next = players.shift()

  console.log('getting', next)
  request(
    `https://neverdrains.com/sf2017/playerIndex.php?disp=player&pid=${next.id}`,
    (error, response, body) => {
      const $playerPage = cheerio.load(body)
      const $rows = $playerPage('table.standings').eq(1).find('tbody tr')
      $rows.each((index, row) => {
        const $row = $playerPage(row)
        const time = moment(
          $row.find('td').eq(0).text().trim(),
          'MMM DD, H:mma'
        ).subtract(tzOffset, 'hours')
        const game = $row.find('td').eq(1).text().trim()
        const score = $row.find('td').eq(2).text().trim().replace(/,/g, '')
        console.log(time,game,score)
        allGames.push({
          playerId: next.id,
          time: time.valueOf(),
          game,
          score
        })
      })

      setTimeout(getNextPlayer, 500)
    }
  )
}

function done() {
  fs.writeFileSync('allGames.json', JSON.stringify(allGames))
}
