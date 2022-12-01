<template>
  <div>
    <vue-advanced-chat
      :current-user-id='currentUserId'
      :messages='JSON.stringify(messages)'
      :messages-actions="JSON.stringify(messageActions)"
      :messages-loaded="messagesLoaded"
      :rooms='JSON.stringify(rooms)'
      :room-actions='JSON.stringify(roomActions)'
      :rooms-loaded='roomsLoaded'
      :loading-rooms="isLoadingRoom"
      :text-messages='JSON.stringify(textMessages)'
      @room-action-handler='roomActionHandler($event.detail[0])'
      height='calc(100vh - 100px)'
      @send-message='sendMessage($event.detail[0])'
      @fetch-messages='fetchMessages($event.detail[0])'
      @fetch-more-rooms='fetchMoreRooms'
    />
  </div>
</template>

<script>
import { register } from 'vue-advanced-chat'
import { Client, Message } from '@stomp/stompjs'
import { mapState } from 'vuex'
import { roomService } from '../_services'

register()

let clientSockJs;

export default {
  data() {
    return {
      currentUserId: this.getUserId(),
      roomActions: [
        { name: 'inviteUser', title: 'Invite User' },
        { name: 'removeUser', title: 'Remove User' },
        { name: 'deleteRoom', title: 'Delete Room' }
      ],
      messageActions: [
        {
          name: 'replyMessage',
          title: 'Reply'
        },
        {
          name: 'editMessage',
          title: 'Edit Message',
          onlyMe: true
        },
        {
          name: 'deleteMessage',
          title: 'Delete Message',
          onlyMe: true
        },
        {
          name: 'selectMessages',
          title: 'Select'
        }
      ],
      textMessages: {
        MESSAGES_EMPTY: 'not messages not found',
      },
      rooms: [],
      messages: [],
      WS_CHAT_URL: config.ws.rtm + '/ws/chat/websocket',
      currentPageRoom: 0,
      currentPageMsg: 0,
      isLoadingRoom: true,
      isLoadingMsg: false,
      isResetRoom: false,
      currentRoomId: null,
      roomsLoaded: false,
      messagesLoaded: false
    }
  },
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  mounted() {
    // configure client sock-js
    clientSockJs = new Client({
      brokerURL: this.WS_CHAT_URL,
      connectHeaders: this.headerWSAuth(),
      debug: function(str) {
        console.log(str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    })
    clientSockJs.configure();

    // connect to ws server
    clientSockJs.onConnect = this.sockJsConnectSuccess;
    clientSockJs.onStompError = this.sockJsConnectError;
    clientSockJs.activate()
  },
  methods: {
    headerWSAuth() {
      return commonUtils.getWSAuthHeader();
    },
    sockJsConnectSuccess(frame) {
      // const headers = { userId: this.getUserId() };
      // clientSockJs.subscribe('/chatroom/connected.users', this.connectedUsers, headers);
      this.getJoinedRooms();
    },
    fetchMoreRooms() {
      console.log("fetchMoreRooms");
      if(this.isLoadingRoom) return;
      this.currentPageRoom++;
      roomService.getJoinedRooms(this.currentPageRoom, this.handleGetJoinedRooms);
    },
    getJoinedRooms() {
      roomService.getJoinedRooms(this.currentPageRoom, this.handleGetJoinedRooms);
    },
    handleGetJoinedRooms(response) {
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
          roomObj.users = users;
          rooms.push(roomObj);
        });

        // show new rooms if has
        if(rooms.length > 0) {
          this.rooms = [...rooms, ...this.rooms];
          // this.rooms = rooms;
        }
      } else {
        console.error(response);
      }
      if(this.isLoadingRoom) this.isLoadingRoom = false;
    },
    sockJsConnectError(frame) {
      console.error('Broker reported error: ' + frame.headers['message'])
      console.error('Additional details: ' + frame.body)
    },
    connectedUsers(response) {
      console.log(response);
    },
    test() {
      let request = {
        userId: this.getUserId()
      }
      let headersObj = this.headerWSAuth();
      clientSockJs.publish({
        destination: '/chatroom/room.get-joined-room',
        body: JSON.stringify(request),
        headers: headersObj,
      });
    },
    getUserId() {
      return this.$store.state.account.user.userId;
    },
    fetchMessages({ room, options = {} }) {
      this.isLoadingMsg = true;
      let roomId = room.roomId;
      this.currentRoomId = roomId;

      if (options.reset) {
        this.isResetRoom = true;
        this.currentPageMsg = 0;
        roomService.getRoomMessages(roomId, this.currentPageMsg, this.handleGetRoomMessages);
      } else {
        this.isResetRoom = false;
        this.currentPageMsg++;
        roomService.getRoomMessages(roomId, this.currentPageMsg, this.handleGetRoomMessages);
      }
    },
    handleGetRoomMessages(response) {
      console.log('roomId : ' + this.currentRoomId);
      if(commonUtils.isResponseOK(response)) {
        let data = response.data;
        let messages = [];
        data.messageItems.forEach((msgItem) => {
          // room info
          let msgObj = {
            _id: msgItem.id,
            content: msgItem.content,
            senderId: msgItem.senderId,
            date: msgItem.date,
            timestamp: msgItem.timestamp,
          }
          // room member info
          msgObj.username = 'John Snow';
          msgObj.avatar = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Star-icon.png';
          messages.push(msgObj);
        });

        // show message if has
        let oldLength = this.messages.length;
        if(this.isResetRoom) {
          this.messages = messages;
        } else {
          this.messages = [...messages, ...this.messages]
        }
        if(this.messages.length == 0 && oldLength == 0) {
          this.messages.push({});
        }
      } else {
        console.error(response);
      }
      this.isLoadingMsg = false;
    },
    roomActionHandler({ roomId, action }) {
      switch (action.name) {
        case 'archiveRoom':
        // call a method to archive the room
      }
    },
    sendMessage(message) {
      this.test();
      this.messages = [
        ...this.messages,
        {
          _id: this.messages.length,
          content: message.content,
          senderId: this.currentUserId,
          timestamp: new Date().toString().substring(16, 21),
          date: new Date().toDateString()
        }
      ]
    },
    addNewMessage() {
      setTimeout(() => {
        this.messages = [
          ...this.messages,
          {
            _id: this.messages.length,
            content: 'NEW MESSAGE',
            senderId: '1234',
            timestamp: new Date().toString().substring(16, 21),
            date: new Date().toDateString()
          }
        ]
      }, 2000)
    }
  }
}
</script>

<style lang='scss'>
body {
  font-family: 'Quicksand', sans-serif;
}
</style>
