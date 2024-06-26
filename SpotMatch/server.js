const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'media' directory
app.use('/media', express.static(path.join(__dirname, 'media')));

// Serve the 'messages.json' file
app.get('/messages.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'messages.json'));
});

// Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
