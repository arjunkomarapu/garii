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

restService.get('/api/products/:id',(req, res) => {
  let sql = "SELECT * FROM product WHERE product_id="+req.params.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show all products
restService.get('/api/products',(req, res) => {
  let sql = "SELECT * FROM product";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

restService.get('/api/products', (req, res) => {

    const productSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.products ? req.body.result.parameters.products : 'The Godfather';
    const reqUrl = encodeURI(`https://1b702621.ngrok.io/api/products`);
    http.get(reqUrl, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const movie = JSON.parse(completeResponse);
            let dataToSend = productSearch === 'show me my products' ? `I don't have the required info on that. Here's some info on 'The Godfather' instead.\n` : '';
            dataToSend += `${products.product_name} is a ${product.product_price}`;

            return res.json({
                speech: dataToSend,
                displayText: dataToSend,
                source: 'webhook-echo-sample'
            });
        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'webhook-echo-sample'
        });
    });
});


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


restService.listen(process.env.PORT || 6000, function() {
  console.log("Server up and listening");
});
