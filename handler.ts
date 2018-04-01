import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda"
let rp = require("request-promise")
let Trello = require("trello")
let winston = require("winston")
require("winston-papertrail").Papertrail // Requiring `winston-papertrail` will expose

let winstonPapertrail = new winston.transports.Papertrail({
  host: "logs3.papertrailapp.com",
  port: 36550
})

let winstonConsole = new winston.transports.Console({
  level: 'debug'
})

var logger = new winston.Logger({
  transports: [
    winstonConsole,
    winstonPapertrail
  ]
})

winstonPapertrail.on("error", function(err) {
  logger && logger.error(err);
})

let CLIENT_KEY = "1b37c7b593ae2d18fd7bc4e4f91c6b11"
let OAUTH_TOKEN = "d43c620a08f43da2e859ff67b4490b2fbc72921eade05714b9b1de59dfddc58f"
let client = require("request-promise")
let trello = new Trello(CLIENT_KEY, OAUTH_TOKEN)



export const hello: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  let boardsPromise = trello.getBoards("me")

  logger.info("hello function called")
  logger.info("event", event)
  logger.info("context", context)

  let awsResponse = function(response, status = 200) {
    cb(null, {
      statusCode: status,
      body: JSON.stringify({ 'body': response })
    })
  }

  var info = {}

  boardsPromise.then(function(boardsRes) {

      logger.debug('boards api response', boardsRes)
      // pull out boards info

      boardsRes.forEach(function(board) {
        info[board.id] = {name: board.name, id: board.id, cards: {}}
      })

      logger.info('info after processing', JSON.stringify(info))

      let batchCardsUrl = boardsRes.map(board => `/boards/${board.id}/cards`).join(",")



      client({
        uri: "https://api.trello.com/1/batch",
        json: true, // Automatically parses the JSON string in the response
        qs: { key: CLIENT_KEY, token: OAUTH_TOKEN, urls: batchCardsUrl }
      })
        .then(function(batchRes) {
          logger.debug('recieved response from trello batch api')
          logger.debug('info before', info)

          for (let batchCount in batchRes) {
            let batch = batchRes[batchCount]
            logger.debug('batch', batch)

            for (let cardCount in batch) {
              let cards = batch[cardCount]

              logger.debug('cards', cards)
              if(cards == undefined || cards.count <= 0) { continue }

              for (let cardCount in cards) {
                let card = cards[cardCount]
                logger.debug('card', card)

                info[card.idBoard].cards[card.id] = {name: card.name}
                //  logger.info('card', card.id, card.name)
              }
            }
          }

          logger.debug('info after', info)
        })
        .finally(function() {
          awsResponse(info)
        })
        // .catch(function(err) {
        //   cb(null, {
        //     statusCode: 200,
        //     body: JSON.stringify({ 'trelloBatchError': err })
        //   })
        // })
    })
    .catch(function(err) {
      awsResponse(err)
    })
}
