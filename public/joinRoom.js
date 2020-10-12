function joinRoom(roomName) {
  // send this roomname to the server
  nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
    // we want to update the  room member total now that we have joined
    document.querySelector(
      '.curr-room-num-users'
    ).innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span
    ></span>`;
  });
  nsSocket.on('historyCatchUp', (history) => {
    console.log(history);
    const messageUl = document.querySelector('#messages');
    messageUl.innerHTML = '';
    history.forEach((msg) => {
      const newMsg = buildHTML(msg);
      const currentMessages = messageUl.innerHTML;
      messageUl.innerHTML = currentMessages + newMsg;
    });
    messageUl.scrollTo(0, messageUl.scrollHeight);
  });
  nsSocket.on('updateMembers', (numMembers) => {
    document.querySelector(
      '.curr-room-num-users'
    ).innerHTML = `${numMembers} <span class="glyphicon glyphicon-user"></span
    ></span>`;
    document.querySelector('.curr-room-text').innerText = `${roomName}`;
  });
}
