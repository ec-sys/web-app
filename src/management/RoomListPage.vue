<template>
  <div class='mt-4'>
    <div class='mb-5'>
      <b-form @submit="onSearch" @reset="onClear">
        <b-form-group id="input-group-1" label="Room name:" label-for="input-1">
          <b-form-input id="input-1" v-model="search.roomName" class='input-search'></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-2" label="Members:" label-for="input-2">
          <b-form-input id="input-2" v-model="search.memberIds" class='input-search'></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Search</b-button>
        <b-button type="button" variant="danger">Clear</b-button>
        <b-button v-if='searching' disabled class='loader-wrapper'>
          <b-spinner small variant="dark" class='loader-icon'></b-spinner>
          <span class="sr-only">Loading...</span>
        </b-button>
      </b-form>
    </div>
    <div class='overflow-auto mt-3'>
      <b-table id='tbl-rooms' :bordered='true' :items='rooms' :fields="tblRoomFields" :per-page='perPage'
               :current-page='currentPage' primary-key="id">
        <template #cell(avatar)="avatar">
          <img :src="avatar.value" class='icon-avatar' width="30" height="30">
        </template>
        <template #cell(status)="data">
          <span v-if="data.item.joined" class='text-primary'>JOINED</span>
          <span v-if="!data.item.joined" class='text-danger'>NON JOINED</span>
        </template>
        <template #cell(action)="data">
          <span v-if="data.item.joined" class='text-info link-join' @click="leftToRoom(data.item.id)">LEFT</span>
          <span v-if="!data.item.joined" class='text-info link-join' @click="joinToRoom(data.item.id)">JOIN</span>
          <span class='text-info link-join ml-2' @click="showModalEditRoom(data.item.id)">EDIT</span>
        </template>
      </b-table>
      <b-pagination v-model='currentPage' :total-rows='totalRoom' :per-page='perPage' aria-controls='tbl-rooms' align='center'></b-pagination>
    </div>
    <b-modal id="modal-room-edit" hide-footer size="lg">
      <template #modal-title>Edit Room</template>
      <div class="d-block">
        <b-form @submit="updateRoom">
          <b-form-group id="modal-room-group-1" label="Room name:" label-for="modal-room-1">
            <b-form-input id="modal-room--1" v-model="selectedRoom.name" required></b-form-input>
          </b-form-group>
          <b-form-group id="modal-room-group-2" label="Avatar:" label-for="modal-room-2">
            <b-form-input id="modal-room-2" v-model="selectedRoom.avatar" required></b-form-input>
          </b-form-group>
          <b-form-group id="modal-room--group-2" label="Description:" label-for="modal-room-3">
            <b-form-textarea id="modal-room-3" v-model="selectedRoom.description" rows="3"></b-form-textarea>
          </b-form-group>

          <b-button type="submit" variant="primary">Save</b-button>
          <b-button v-if='savingRoom' disabled class='loader-wrapper'>
            <b-spinner small variant="dark" class='loader-icon'></b-spinner>
            <span class="sr-only">Loading...</span>
          </b-button>
        </b-form>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { roomService } from '../_services'

export default {
  data() {
    return {
      searching: false,
      perPage: 20,
      currentPage: 1,
      totalRoom: 0,
      tblRoomFields: [
        {key: "name", label: "Name", thStyle: { width: "20%" }},
        {key: "avatar", label: "Avatar", thStyle: { width: "10%" } },
        {key: "description", label: "Description", thStyle: { width: "30%" }},
        {key: "status", label: "Status", thStyle: { width: "20%" }},
        {key: "action", label: "Action", thStyle: { width: "20%" }},
      ],
      rooms: [],
      search: {
        roomName: '',
        memberIds: ''
      },
      selectedRoom: {},
      savingRoom: false
    }
  },
  mounted() {
    this.firstLoadPage();
  },
  computed: {
  },
  methods: {
    firstLoadPage() {
      this.doSearch();
    },
    handleSearchRooms(response) {
      if(commonUtils.isResponseOK(response)) {
        let roomItems = response.data.roomItems;
        let roomArr = [];

        // build
        roomItems.forEach((room) => {
          roomArr.push({
            id : room.id, name : room.name, avatar : room.avatar, description : room.description, joined: room.joined
          });
        });

        this.currentPage = 1;
        this.rooms = roomArr;
        this.totalRoom = roomArr.length;
      } else {
        console.error(response);
      }
      this.searching = false;
    },
    joinToRoom(roomId) {
      roomService.joinToRoom(roomId, this.handleJoinLeftToRoom);
      this.updateJoinedState(roomId, true);
    },
    leftToRoom(roomId) {
      roomService.leftToRoom(roomId, this.handleJoinLeftToRoom);
      this.updateJoinedState(roomId, false);
    },
    handleJoinLeftToRoom(response) {
      if(commonUtils.isResponseOK(response)) {
      } else {
        console.error(response);
      }
    },
    updateJoinedState(roomId, joined) {
      let room = this.findRoomById(roomId);
      // update room
      if(room.idx != undefined) {
        room.item.joined = joined;
        this.rooms[room.idx] = room.item;
      }
    },
    onSearch(event) {
      event.preventDefault();
      this.doSearch();
    },
    doSearch() {
      if(this.searching) return;
      this.searching = true;
      roomService.searchRooms(this.search, this.handleSearchRooms);
    },
    onClear(event) {
      event.preventDefault();
      this.search.roomName = '';
      this.search.memberIds = '';
    },
    showModalEditRoom(roomId) {
      this.savingRoom = false;
      let room = this.findRoomById(roomId);
      // update room
      if(room.idx != undefined) {
        this.selectedRoom = room.item;
        this.$bvModal.show('modal-room-edit');
      } else {
        alert("Not Found Room Id : " + roomId);
      }
    },
    updateRoom(event) {
      event.preventDefault();
      if(this.savingRoom) return;
      this.savingRoom = true;
      roomService.updateRoom(this.selectedRoom, this.handleUpdateRoom);
    },
    handleUpdateRoom(response) {
      if(commonUtils.isResponseOK(response)) {
        commonUtils.showToastSaveOK();
      } else {
        commonUtils.showToastSaveNG();
      }
      this.$bvModal.hide('modal-room-edit');
    },
    findRoomById(roomId) {
      let selectedRoom = undefined;
      let selectedIdx = undefined;
      // find selected room
      this.rooms.forEach((room, index) => {
        if(room.id === roomId) {
          selectedRoom = room;
          selectedIdx = index;
          return;
        }
      });
      return {
        idx: selectedIdx,
        item: selectedRoom
      }
    }
  }
}
</script>


<style scoped>
.icon-avatar {
  border-radius: 15px;
}
.link-join {
  text-decoration: underline;
}
.link-join:hover {
  cursor: pointer;
}
.input-search {
  width: 500px;
}
</style>
