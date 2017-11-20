const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const d3Dsv = require('d3-dsv')

request(
  'https://neverdrains.com/sf2017/playerIndex.php?disp=player',
  (error, response, body) => {
    const $playerPage = cheerio.load(body)
    const players = $playerPage('td[class="row0"], td[class="row1"]').map((index, element) => {
      const $td = $playerPage(element)
      const name = $td.text().trim()
      if(name === '') return null
      const link = $td.find('a').attr('href')
      const id = link.match(/pid=([0-9]+)/)[1]
      console.log(name, id)
      return {name, id}
    }).get()
    console.log(players)
    fs.writeFileSync('players.json', JSON.stringify(players))

  }
)
