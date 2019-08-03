const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const serveStatic = require('serve-static');
const path = require('path');
const config = require('./util/config');

const app = express();
var server = require('http').createServer(app);

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const spotifyRoutes = require('./routes/SpotifyRoutes.js');
app.use('/spotify', spotifyRoutes);
app.use("/", serveStatic(path.join(__dirname, '/dist')));
// Catch all routes and redirect to the index file
app.get('*', function (req, res) {
  res.sendFile(__dirname + '/dist/index.html')
});

const port = process.env.PORT || config.serverPort;
var baseURL = config.baseURL;
server.listen(port, () => console.log('Server listening on port ' + baseURL + port));