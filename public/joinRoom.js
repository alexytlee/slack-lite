function joinRoom(roomName) {
  // send this roomname to the server
  nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
    // we want to update the  room member total now that we have joined
    document.querySelector(
      '.curr-room-num-users'
    ).innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span
    ></span>`;
  });
}
