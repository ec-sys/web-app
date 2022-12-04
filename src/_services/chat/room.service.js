import axios from 'axios';

export const roomService = {
  getJoinedRooms, getRoomMessages
}

function getJoinedRooms(pageNumber, handleResponse) {
  let user = commonUtils.getStoreUser();
  const params = {
    userId: user.userId,
    currentPage: pageNumber
  }
  const headers = {
    headers: commonUtils.getApiHeaderJson()
  };

  axios.post(config.api.chat + '/room/find-joined-room', params, headers)
    .then(handleResponse) // handle ok
    .catch(handleResponse) // handle error
    .then(function () {}); // always executed
}

function getRoomMessages(roomId, pageNumber, handleResponse) {
  const params = {
    roomId: roomId,
    currentPage: pageNumber
  }
  const headers = {
    headers: commonUtils.getApiHeaderJson()
  };

  axios.post(config.api.chat + '/message/get-room-messages', params, headers)
    .then(handleResponse) // handle ok
    .catch(handleResponse) // handle error
    .then(function () {}); // always executed
}
