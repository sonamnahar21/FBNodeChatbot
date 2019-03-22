'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const token = process.env.FB_VERIFY_TOKEN
const acccess= process.env.FB_ACCESS_TOKEN

const app = express()

app.set('port',(process.env.PORT ||5000));

//allows us to process data 
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//routes
app.get('/', function (req,res){
    res.send('Hi I am a chatbot')
})

//FACEBOOK
app.get('/webhook/',function (req,res){
    if(req.query['hub.verify_token']===token){
        res.send(req.query['hub.challenge'])
    }
    res.send('wrong token')
})

app.post('/webhook', (req, res) => {  

    // Parse the request body from the POST
    let body = req.body;
  
    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
  
      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
        var pageID = entry.id;
        var timeOfEvent = entry.time;

        entry.messaging.forEach(function(event){
            if(event.message){
                console.log(event.message)
            }
            else{
                console.log('Webhook received unknow event: ', event);
            }
        })

        // // Get the webhook event. entry.messaging is an array, but 
        // // will only ever contain one event, so we get index 0
        // let webhook_event = entry.messaging[0];
        // console.log(webhook_event);
        
      });
  
      // Return a '200 OK' response to all events
      res.status(200).send('EVENT_RECEIVED');
  
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });

//start server
app.listen(app.get('port'),function(){
    console.log('running on port' , app.get('port'))
})