<template>
  <div class='mt-4'>
    <div class='mb-5'>
      <b-form @submit="onSubmit" @reset="onClear">
        <b-form-group id="input-group-1" label="Room name:" label-for="input-1">
          <b-form-input id="input-1" v-model="search.roomName" type="input"></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-2" label="Members:" label-for="input-1">
          <b-form-input id="input-2" v-model="search.memberIds" type="input"></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Search</b-button>
        <b-button type="reset" variant="danger">Clear</b-button>
      </b-form>
    </div>
    <div class='overflow-auto mt-3'>
      <b-table id='tbl-rooms' :bordered='true' :items='rooms' :fields="tblRoomFields" :per-page='perPage'
               :current-page='currentPage' :filter-included-fields='filters' primary-key="id">
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
        </template>
      </b-table>
      <b-pagination v-model='currentPage' :total-rows='totalRoom' :per-page='perPage' aria-controls='tbl-rooms' align='center'></b-pagination>
    </div>
  </div>
</template>

<script>
import { roomService } from '../_services'

export default {
  data() {
    return {
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
      filters: ['name'],
      rooms: [],
      search: {
        roomName: '',
        memberIds: ''
      }
    }
  },
  mounted() {
    this.firstLoadPage();
  },
  computed: {
  },
  methods: {
    firstLoadPage() {
      roomService.searchRooms(this.search, this.handleSearchRooms);
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
      // update room
      if(selectedRoom != undefined) {
        selectedRoom.joined = joined;
        this.rooms[selectedIdx] = selectedRoom;
      }
    },
    onSubmit(event) {
      event.preventDefault();
      roomService.searchRooms(this.search, this.handleSearchRooms);
    },
    onClear(event) {
      event.preventDefault();
      this.search.roomName = '';
      this.search.memberIds = '';
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
</style>
