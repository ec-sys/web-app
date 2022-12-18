import axios from 'axios';

export const roomService = {
  getJoinedRooms, getRoomMessages, searchRooms, getAllRooms,
  joinToRoom, leftToRoom,
  updateRoom
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

function getAllRooms(handleResponse) {
  const params = {
  }
  const headers = {
    headers: commonUtils.getApiHeaderJson()
  };

  axios.post(config.api.chat + '/room/get-all-room', params, headers)
    .then(handleResponse) // handle ok
    .catch(handleResponse) // handle error
    .then(function () {}); // always executed
}

function joinToRoom(roomId, handleResponse) {
  const params = {
    roomId: roomId
  }
  const headers = {
    headers: commonUtils.getApiHeaderJson()
  };

  axios.post(config.api.chat + '/room/join-room', params, headers)
    .then(handleResponse) // handle ok
    .catch(handleResponse) // handle error
    .then(function () {}); // always executed
}

function leftToRoom(roomId, handleResponse) {
  const params = {
    roomId: roomId
  }
  const headers = {
    headers: commonUtils.getApiHeaderJson()
  };

  axios.post(config.api.chat + '/room/left-room', params, headers)
    .then(handleResponse) // handle ok
    .catch(handleResponse) // handle error
    .then(function () {}); // always executed
}

function searchRooms(params, handleResponse) {
  let user = commonUtils.getStoreUser();
  params.userId = user.userId;

  const headers = {
    headers: commonUtils.getApiHeaderJson()
  };

  axios.post(config.api.chat + '/room/search-room', params, headers)
    .then(handleResponse) // handle ok
    .catch(handleResponse) // handle error
    .then(function () {}); // always executed
}

function updateRoom(params, handleResponse) {
  const headers = {
    headers: commonUtils.getApiHeaderJson()
  };

  axios.post(config.api.chat + '/room/update-room', params, headers)
    .then(handleResponse) // handle ok
    .catch(handleResponse) // handle error
    .then(function () {}); // always executed
}
