const line = require('@line/bot-sdk')
const express = require('express')
const axios = require('axios').default
const dotenv = require('dotenv')
const { handle } = require('express/lib/application')
const app = express()
const MessagingApiClient = line.messagingApi.MessagingApiClient;


const env = dotenv.config().parsed
const client = new MessagingApiClient({
    channelAccessToken: env.ACCESS_TOKEN,
    channelSecretToken: env.SECRET_TOKEN
});

const middle = line.middleware({
  channelAccessToken: env.ACCESS_TOKEN,
  channelSecret: env.SECRET_TOKEN
});


app.post('/webhook', middle , async (req, res) => {
    try {
        const events = req.body.events
        console.log('event==>>', events)
        return events.length > 0 ? await events.map(item => handleEvent(item)) : res.status(200).send("OK")
    }
    catch (error){
        res.status(500).end()
    }
})

const handleEvent = (event) => {

  const message = client.replyMessage({ 
    replyToken: event.replyToken,
    messages: [{
      type: 'text',
      text: event.message.text
    }],
  });
  console.log(message)
  return message;
}

app.listen(4000, () => {
    console.log("listening on port 4000")
})