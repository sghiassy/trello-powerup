import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda"
let rp = require("request-promise")
let Trello = require('trello')

let CLIENT_KEY = "1b37c7b593ae2d18fd7bc4e4f91c6b11"
let OAUTH_TOKEN = "d43c620a08f43da2e859ff67b4490b2fbc72921eade05714b9b1de59dfddc58f"
let trello = new Trello(CLIENT_KEY, OAUTH_TOKEN)

export const hello: Handler = (event: APIGatewayEvent, context: Context, cb: Callback) => {
  let boards = trello.getBoards('me')

  boards.then((res) => {
    let info = res.map((board) => {return {name:board.name, id: board.id}})
    cb(null, info)
  })
  .catch((err) => {
    cb(null, { statusCode: 200, body: JSON.stringify({trelloError: err })})
  })
}
