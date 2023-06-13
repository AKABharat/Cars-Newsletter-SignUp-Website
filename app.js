const express = require('express');
const bodyParser = require('body-parser');
const https = require("https");
const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const FirstName = req.body.FName;
  const LastName = req.body.LName;
  const Email = req.body.email;
  console.log(FirstName + " " + LastName + " " + Email);

  const data = {  // here, data is an object which we will send to mailchimp
    members: [
      {
        email_address: Email,
        status: "subscribed",
        merge_fields: {
          FNAME: FirstName,
          LNAME: LastName,
        }
      }
    ],
  }

  const JsonData = JSON.stringify(data);  // we will send our data object to maichimp in the form of JSON and not JavaScript



  const url = "https://us21.api.mailchimp.com/3.0/lists/23f94ada41"

  const options = {
    method: "POST",
    auth: "AKABharat:_MY_API_KEY_😏",
  }

  const mailChimpRequest = https.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }

  });
  mailChimpRequest.write(JsonData);
  mailChimpRequest.end();
});

app.post("/TryAgain", function (req, res) {
  res.redirect("/");
});

// process.env.PORT is a dynamic port which will be defined by heroku rather than a local port 3000
// process is an object defined by heroku
// using || or operator , we can run or application/app both on heroku and port 3000 
app.listen(process.env.PORT || 3000, () => {
  console.log("server running on port no. 3000");
});

