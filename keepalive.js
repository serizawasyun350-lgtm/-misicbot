const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Discord Music Bot is alive!');
});

function keepAlive() {
  app.listen(PORT, () => {
    console.log(`Keep-alive server is listening on port ${PORT}`);
  });
}

module.exports = keepAlive;
