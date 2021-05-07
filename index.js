#!/usr/bin/env node

/**
 * Module dependencies.
 */

 var createError = require('http-errors');
 var express = require('express');
 var http = require('http');
 var path = require('path');
 var cookieParser = require('cookie-parser');
 var logger = require('morgan');
 var cors = require('cors');
 var mongoose = require('mongoose');
 
 require('./models/User');
 
 mongoose.connect('mongodb://localhost/soki');
 
 var indexRouter = require('./routes/index');
 var usersRouter = require('./routes/users');
 
 var app = express();
 
 // view engine setup
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'jade');
 
 
 app.use(cors());
 app.use(logger('dev'));
 app.use(express.json());
 app.use(express.urlencoded({ extended: false }));
 app.use(cookieParser());
 app.use(express.static(path.join(__dirname, 'public')));
 
 app.use('/', indexRouter);
 app.use('/users', usersRouter);
 
 // catch 404 and forward to error handler
 app.use(function(req, res, next) {
   next(createError(404));
 });
 
 // error handler
 app.use(function(err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};
 
   // render the error page
   res.status(err.status || 500);
   res.render('error');
 });

var debug = require('debug')('soki-back:server');




 /**
  * Get port from environment and store in Express.
  */
 
 var port = normalizePort(process.env.PORT || '3000');
 app.set('port', port);
 
 /**
  * Create HTTP server.
  */
 
 var server = http.createServer(app);
 
 /**
  * Listen on provided port, on all network interfaces.
  */
 
 server.listen(port);
 server.on('error', onError);
 server.on('listening', onListening);
 
 /**
  * Normalize a port into a number, string, or false.
  */
 
 function normalizePort(val) {
   var port = parseInt(val, 10);
 
   if (isNaN(port)) {
     // named pipe
     return val;
   }
 
   if (port >= 0) {
     // port number
     return port;
   }
 
   return false;
 }
 
 /**
  * Event listener for HTTP server "error" event.
  */
 
 function onError(error) {
   if (error.syscall !== 'listen') {
     throw error;
   }
 
   var bind = typeof port === 'string'
     ? 'Pipe ' + port
     : 'Port ' + port;
 
   // handle specific listen errors with friendly messages
   switch (error.code) {
     case 'EACCES':
       console.error(bind + ' requires elevated privileges');
       process.exit(1);
       break;
     case 'EADDRINUSE':
       console.error(bind + ' is already in use');
       process.exit(1);
       break;
     default:
       throw error;
   }
 }
 
 /**
  * Event listener for HTTP server "listening" event.
  */
 
 function onListening() {
   var addr = server.address();
   var bind = typeof addr === 'string'
     ? 'pipe ' + addr
     : 'port ' + addr.port;
   debug('Listening on ' + bind);
 }

const io = require("socket.io")(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const formatMessage = require('./messages.js');
const { userJoin, getCurrentUser, userLeave, getRoomUsers, getUsers } = require('./users.js');
const botname = "Soki Bot";
var userName = "anonymous";

app.get('/', (req, res) => {
  res.sendFile('../soki-front/rtmp/index.html');
});

io.on('connection', (socket) => {
  let id = socket.id;
  socket.emit('id', id);

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, userName, room);

    socket.join(user.room);

    socket.emit('roomUsers', {
      room: user.username
    });

    io.emit('allUsers', {
      room: user,
      users: getUsers()
    });

    socket.emit("message", formatMessage(botname, user.username + " welcome to the chat !"));
    socket.broadcast
    .to(user.room)
    .emit("message", formatMessage(botname, user.username + " has joined the chat"));

    socket.on('userleave', () => {
      userLeave(socket.id);
    })
  });

  socket.on('leaveRoom', ( room ) => {
    const user = userLeave(socket.id);

    if(user){
      socket.broadcast.to(room).emit('message', formatMessage(botname, userName + ' has left the chat'));
      
      // io.emit('roomUsers', {
      //   room: user.room,
      //   users: getRoomUsers(user.room)
      // });
    }
    socket.leave(room);
  });

  socket.on('chat message', (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('chat message', formatMessage(userName, msg));
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if(user){
      io.to(user.room).emit('message', formatMessage(botname, 'A user have left the chat'));
      
      io.emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
      socket.leave(user.room);

    }
  })

  

  // socket.on('channel', (user) => {
  //   io.emit('channel', user);
  // });

  socket.on('username', (username) => {
    userName = username;
    // io.emit('username', username);
  })
});
