"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql');

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/echo", function(req, res) {
  var speech =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.echoText
      ? req.body.queryResult.parameters.echoText
      : "Seems like some problem. Speak again.";
  
  var speechResponse = {
    google: {
      expectUserResponse: true,
      richResponse: {
        items: [
          {
            simpleResponse: {
              textToSpeech: speech
            }
          }
        ]
      }
    }
  };
  
  return res.json({
    payload: speechResponse,
    //data: speechResponse,
    fulfillmentText: speech,
    speech: speech,
    displayText: speech,
    source: "webhook-echo-sample"
  });
});

//creating database connection
const conn = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Needyin@123',
  database: 'needyin'
});
//connecting to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
//show all products
restService.get('/api/products',(req, res) => {
  let sql = "SELECT * FROM product";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
