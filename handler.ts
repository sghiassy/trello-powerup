import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda"
let rp = require("request-promise")
let Trello = require("trello")

let CLIENT_KEY = "1b37c7b593ae2d18fd7bc4e4f91c6b11"
let OAUTH_TOKEN = "d43c620a08f43da2e859ff67b4490b2fbc72921eade05714b9b1de59dfddc58f"
let client = require("request-promise")
let trello = new Trello(CLIENT_KEY, OAUTH_TOKEN)

export const hello: Handler = (
  event: APIGatewayEvent,
  context: Context,
  cb: Callback
) => {
  let boardsPromise = trello.getBoards("me")

  console.log("hello function called")
  console.log("event", event)
  console.log("context", context)

  boardsPromise
    .then(res => {
      // pull out boards info
      var info = res.map(board => {
        let boardId = board.id
        return { boardId: { name: board.name, id: boardId } }
      })

      let batchCardsUrl = res
        .map(board => `/boards/${board.id}/cards`)
        .join(",")

      client({
        uri: "https://api.trello.com/1/batch",
        json: true, // Automatically parses the JSON string in the response
        qs: { key: CLIENT_KEY, token: OAUTH_TOKEN, urls: batchCardsUrl }
      })
        .then(res => {
          for (let batchCount in res) {
            let batch = res[batchCount]

            for (let cardCount in batch) {
              let cards = batch[cardCount]

              for (let cardCount in cards) {
                let card = cards[cardCount]

                if (info[card.boardId].cards == undefined) {
                  info[card.boardId].cards = []
                }

                let cardId = card.id
                let cardName = card.name
                info[card.boardId].cards.push({ cardId: { name: cardName } })
                // console.log('card', card.id, card.name)
              }
            }
          }

          console.log("info", info)
          cb(null, { statusCode: 200, body: JSON.stringify({info:info}) })
        })
        .catch(err => {
          cb(null, { statusCode: 200, body: JSON.stringify({trelloBatchError:err}) })
        })
    })
    .catch(err => {
      cb(null, { statusCode: 200, body: JSON.stringify({trelloBoardsError:err}) })
    })
}
