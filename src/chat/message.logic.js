export function updateUserDataOfMessage(msgObj, mapUsers) {
  let user = mapUsers.get(msgObj.senderId);
  if(commonUtils.isObjectNotNull(user)) {
    msgObj.username = user.username;
    msgObj.avatar = user.avatar;
  } else {
    msgObj.username = 'Anonymous';
    msgObj.avatar = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Star-icon.png';
  }
}

export function buildMessage(msgRaw) {
  let msgObj = {
    _id: msgRaw.id,
    content: msgRaw.content,
    senderId: msgRaw.senderId,
    timestamp: msgRaw.timestamp,
    date: msgRaw.date
  }
  return msgObj;
}
