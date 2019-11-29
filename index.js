const express = require('express');

const app = express();

// Query params = ?test=1
// Route params = /users/1
// Request body = {  }

app.get('/teste', (req, res) => {
  return res.json({ messege: 'Hello World' })
})

app.listen(4000);
