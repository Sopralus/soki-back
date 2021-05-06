const express = require('express');
const app = express();

app.use(express.urlencoded());

app.post("/auth", function (req, res) {
  /* This server is only available to nginx */
  const streamkeys = req.body.key;
  // var userexist = false;

  // const apiup = "http://localhost:3000/users/" + streamkeys;
  // fetch(apiup, {
  //   method: 'POST',
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({
  //     streamkey: streamkeys
  //   })
    
  // }).then(res => res.json()).then(res => {
  //   if(res.username){
  //     userexist = true;
  //   }
  // });


  /* You can make a database of users instead :) */
  // if (userexist === "true") {
  //   res.status(200).send();
  //   return;
  // }

  if (streamkeys === "supersecret") {
    res.status(200).send();
    return;
  }

  /* Reject the stream */
  res.status(403).send();
  
});

app.listen(8000, function () {
  console.log("Listening on port 8000!");
});