// server-side
const express = require('express');
const app = express();
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');
// console.log(namespaces[0]);

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);
io.on('connection', (socket) => {
  // build an array to send back with the img and endpoint for each namespace
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });
  // console.log(nsData);
  //send the nsdata basck to the client, we need to use socket, not io, becuase we want it to go to a specific client
  socket.emit('nsList', nsData);
});

// loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  // console.log(namespace);
  io.of(namespace.endpoint).on('connection', (nsSocket) => {
    console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
    // a socket has connected to one of our chatgroup namespaces
    // send that ns group info back
    nsSocket.emit('nsRoomLoad', namespace.rooms);

    nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
      // deal with history... once we have it
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);
      updateUsersInRoom(namespace, roomToLeave);
      nsSocket.join(roomToJoin);
      // io.of(namespace.endpoint)
      //   .in(roomToJoin)
      //   .clients((error, clients) => {
      //     // console.log(clients.length);
      //     numberOfUsersCallback(clients.length);
      //   });
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin;
      });

      nsSocket.emit('historyCatchUp', nsRoom.history);
      updateUsersInRoom(namespace, roomToJoin);
    });

    nsSocket.on('newMessageToServer', (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: 'alexytlee',
        avatar: 'https://via.placeholder.com/30',
      };
      console.log(fullMsg);
      // send this message to all the sockets that are in the room that THIS socket is in

      // how do we find out which socket we are in?
      console.log(nsSocket.rooms);
      // the user will be in the 2nd room in the object list
      // this is because the socket always joins its own room on connection
      // get the keys
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      // we need to find the Room object for this room
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomTitle;
      });
      console.log(
        'the room object that we made that matches this namespace room is...'
      );
      console.log(nsRoom);
      if (nsRoom) {
        nsRoom.addMessage(fullMsg);
      }
      io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg);
    });
  });
});

function updateUsersInRoom(namespace, roomToJoin) {
  // send back the number of users in this room to ALL sockets connected to this room
  io.of(namespace.endpoint)
    .in(roomToJoin)
    .clients((error, clients) => {
      console.log(`there are ${clients.length} user(s) in this room`);
      io.of(namespace.endpoint)
        .in(roomToJoin)
        .emit('updateMembers', clients.length);
    });
}
