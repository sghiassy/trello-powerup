import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda"
let rp = require("request-promise")
let Trello = require('trello')

let CLIENT_KEY = "1b37c7b593ae2d18fd7bc4e4f91c6b11"
let OAUTH_TOKEN = "d43c620a08f43da2e859ff67b4490b2fbc72921eade05714b9b1de59dfddc58f"
let client = require('request-promise');
let trello = new Trello(CLIENT_KEY, OAUTH_TOKEN)


export const hello: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  let boardsPromise = trello.getBoards('me')

  boardsPromise.then((res) => {
    let info = res.map((board) => {return {name:board.name, id: board.id}})
    let batchCardsUrl = res.map((board) => `/boards/${board.id}/cards`).join(',')

  client({
    uri: "https://api.trello.com/1/batch",
    json: true, // Automatically parses the JSON string in the response
    qs: { key: CLIENT_KEY, token: OAUTH_TOKEN, urls: batchCardsUrl }
  })
    .then(function(res) {
      cb(null, { statusCode: 200, body: JSON.stringify({boards:info,batch:res}) })
    })
    .catch(function(err) {
      cb(null, { statusCode: 200, body: JSON.stringify({trelloError: err })})
    });
  })
  .catch((err) => {
    cb(null, { statusCode: 200, body: JSON.stringify({trelloError: err })})
  })
}
