export function handleFetchRooms(response, pageRoom) {
  if(commonUtils.isResponseOK(response)) {
    let data = response.data;
    let rooms = [];
    data.roomItems.forEach((roomItem) => {
      // room info
      let roomObj = {
        roomId: roomItem.id,
        roomName: roomItem.name,
        avatar: roomItem.avatar
      }
      // room member info
      let users = [];
      roomItem.members.forEach((member) => {
        users.push({
          _id: member.userId,
          username: member.name,
          avatar: member.avatar,
          status: {
            state: 'online',
            lastChanged: 'today, 14:30'
          }
        })
      });

      console.log(users);
      roomObj.users = users;
      rooms.push(roomObj);
    });

    // show new rooms if has
    if(rooms.length > 0) {
      pageRoom = [...rooms, ...pageRoom];
    }
  } else {
    console.error(response);
  }
}
