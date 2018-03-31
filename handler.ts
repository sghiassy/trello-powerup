import { APIGatewayEvent, Callback, Context, Handler } from "aws-lambda";

let CLIENT_KEY = "1b37c7b593ae2d18fd7bc4e4f91c6b11";
let OAUTH_TOKEN =
  "d43c620a08f43da2e859ff67b4490b2fbc72921eade05714b9b1de59dfddc58f";

// Script tag to make JS requests using CLIENT_KEY
// <script src="https://api.trello.com/1/client.js?key=1b37c7b593ae2d18fd7bc4e4f91c6b11"></script>

// let BOARDS_CALL = "https://api.trello.com/1/member/me/boards?key=1b37c7b593ae2d18fd7bc4e4f91c6b11&token=8c08ea16375c2aad4be4d9e48d491f36d17370274f4a6e798272edae95d271f9"

let rp = require("request-promise");

export const hello: Handler = (
  event: APIGatewayEvent,
  context: Context,
  cb: Callback
) => {
  rp(
    `https://api.trello.com/1/member/me/boards?key=${CLIENT_KEY}&token=${OAUTH_TOKEN}`
  )
    .then(function(htmlString) {
      cb(null, htmlString);
    })
    .catch(function(err) {
      cb(null, err);
    });
};
