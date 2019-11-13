"use strict";

const express = require("express");
const bodyParser = require("body-parser");

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

app.post('/jobs', (req, res) => {
	const jobsSearch =
		req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.jobs
			? req.body.result.parameters.jobs
			: ''

	const reqUrl = encodeURI(
		`https://api.needyin.com/index.php/restApi/user_jobs/search`
	)
	http.get(
		reqUrl,
		responseFromAPI => {
			let completeResponse = ''
			responseFromAPI.on('data', chunk => {
				completeResponse += chunk
			})
			responseFromAPI.on('end', () => {
				const movie = JSON.parse(completeResponse)

				let dataToSend = jobsSearch
				dataToSend = `${jobs.des_name} ${jobs.job_desc}.${
					jobs.company_name
				} ${jobs.company_email}. ${jobs.min_exp}.${jobs.max_exp}.${jobs.creation_date}.${jobs.min_salary}.${jobs.loc_name}.${jobs.emp_name}
                }`

				return res.json({
					fulfillmentText: dataToSend,
					source: 'webhook-echo-sample'
				})
			})
		},
		error => {
			return res.json({
				fulfillmentText: 'Could not get results at this time',
				source: 'webhook-echo-sample'
			})
		}
	)
})

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
