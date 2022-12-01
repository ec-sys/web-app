import axios from 'axios';

export const roomService = {
  getJoinedRooms
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

  axios.post(config.api.rtm + '/room/chat-user/find-joined-room', params, headers)
    .then(handleResponse) // handle ok
    .catch(handleResponse) // handle error
    .then(function () {}); // always executed
}
