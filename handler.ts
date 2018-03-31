import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda"
let rp = require("request-promise")

let CLIENT_KEY = "1b37c7b593ae2d18fd7bc4e4f91c6b11"
let OAUTH_TOKEN = "d43c620a08f43da2e859ff67b4490b2fbc72921eade05714b9b1de59dfddc58f"

console.log("starting")

export const hello: Handler = (
  event: APIGatewayEvent,
  context: Context,
  cb: Callback
) => {
  console.log('Function Invoked')
  console.log("event", event)
  console.log("context", context)

  rp({
    uri: "https://api.trello.com/1/member/me/boards",
    qs: { key: CLIENT_KEY, token: OAUTH_TOKEN },
    headers: { "User-Agent": "Request-Promise" },
    json: true
  })
    .then(function(res) {
      console.log("res", res)

      cb(null, {
        statusCode: 200,
        body: JSON.stringify({
          trelloResponse: res
        })
      })
    })
    .catch(function(err) {
      console.log("err", err)

      cb(null, {
        statusCode: 200,
        body: JSON.stringify({
          trelloError: err
        })
      })
    })
}

console.log("end")
