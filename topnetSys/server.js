const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const socket = require('socket.io');
const passport = require('passport');
cors = require('cors');
const path = require('path');


const port = process.env.PORT || 5000;
const users = require('./routes/api/userApi');
const profile = require('./routes/api/profileApi');
const image = require('./routes/api/ImageApi');
const products = require('./routes/api/productApi');
const categories = require('./routes/api/categoryApi');
const productPropertiesApi = require('./routes/api/productPropertiesApi');
const property = require("./routes/api/propertyApi");
const clients = require('./routes/api/clientApi');




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  });

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/image',image);
app.use('/api/clients', clients);
app.use('/api/product', products);
app.use('/api/category', categories);
app.use('/api/productproperties', productPropertiesApi);
app.use("/api/property", property);


const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

//Getting connected users on the dashboard 
//this functionnality can be used everywhere 
//to view the numbers of connected users on the website
const io = socket(server);
let online = 0;

io.on('connection', (socket) => {
  online++;
  var address = socket.handshake.address;
  console.log(`Socket ${socket.id} connected.`);
  console.log(`Online: ${online}`);
  var clientIp = socket.request.connection.remoteAddress;
  console.log(clientIp);
  io.emit('visitor enters', online);

  socket.on('add', data => socket.broadcast.emit('add', data));
  socket.on('update', data => socket.broadcast.emit('update', data));
  socket.on('delete', data => socket.broadcast.emit('delete', data));

  socket.on('disconnect', () => {
    online--;
    console.log(`Socket ${socket.id} disconnected.`);
    console.log(`Online: ${online}`);
    io.emit('visitor exits', online);
  });
});