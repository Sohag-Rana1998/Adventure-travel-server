const express = require("express");
const app = express();
const cors = require("cors");

require('dotenv').config()
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;






app.get('/', (req, res) => {
  res.send('Travel zone server is running')
})

app.listen(port, () => {
  console.log(`Travel server is running on port${port}`);
})