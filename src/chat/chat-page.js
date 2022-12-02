import { register } from 'vue-advanced-chat'
import { Client, Message } from '@stomp/stompjs'
import { mapState } from 'vuex'
import { roomService } from '../_services'
import {handleFetchRooms} from './room-component'

register()

let clientSockJs;
let roomSubscription;

const Nanoid = require('nanoid');

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
      tempMsgIds: new Map(),
      currentPageRoom: 0,
      currentPageMsg: 0,
      firstLoadingRoom: true,
      isLoadingRoom: false,
      isLoadingMsg: false,
      isResetRoom: false,
      currentRoom: null,
      mapUsers: new Map(),
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
    connectedUsers(response) {
      console.log(response);
    },
    fetchMoreRooms() {
      if(this.isLoadingRoom) return;
      this.currentPageRoom++;
      this.getJoinedRooms();
    },
    getJoinedRooms() {
      this.isLoadingRoom = true;
      roomService.getJoinedRooms(this.currentPageRoom, this.handleGetJoinedRooms);
    },
    handleGetJoinedRooms(response) {
      // handleFetchRooms(response, this.rooms);
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
          this.rooms = [...rooms, ...this.rooms];
          // this.rooms = rooms;
        }
      } else {
        console.error(response);
      }
      this.setLoadingRoomStatus();
    },
    // frame work is error then temporary fix
    setLoadingRoomStatus() {
      if(this.firstLoadingRoom) this.firstLoadingRoom = false;
      if(this.isLoadingRoom) this.isLoadingRoom = false;
      this.roomsLoaded = true;
      setTimeout(() => {
        this.roomsLoaded = false;
      }, 100);
    },
    sockJsConnectError(frame) {
      console.error('Broker reported error: ' + frame.headers['message'])
      console.error('Additional details: ' + frame.body)
    },
    getUserId() {
      return this.$store.state.account.user.userId;
    },
    fetchMessages({ room, options = {} }) {
      this.isLoadingMsg = true;
      let roomId = room.roomId;

      if (options.reset) {
        this.currentRoom = room;
        this.isResetRoom = true;
        this.messagesLoaded = false;

        this.mapUsers.clear();
        room.users.forEach((user) => {
          this.mapUsers.set(user._id, user);
        });

        this.currentPageMsg = 0;
        this.tempMsgIds.clear();

        roomSubscription = clientSockJs.subscribe('/topic/' + roomId + '.public.messages', this.publicMessages);
        roomService.getRoomMessages(roomId, this.currentPageMsg, this.handleGetRoomMessages);
      } else {
        this.isResetRoom = false;
        this.currentPageMsg++;
        roomService.getRoomMessages(roomId, this.currentPageMsg, this.handleGetRoomMessages);
      }
    },
    publicMessages(response) {
      let message = JSON.parse(response.body);
      let tempMsgId = message.tempMessageId;
      if(this.tempMsgIds.has(tempMsgId)) {
        let updateMsgObj = undefined;
        let updateMsgIdx = 0;
        this.messages.forEach((item, index) => {
          if(item._id === tempMsgId) {
            updateMsgObj = item;
            updateMsgIdx = index;
            return;
          }
        });
        if(updateMsgObj != undefined) {
          updateMsgObj._id = message.messageId;
          this.messages[updateMsgIdx] = updateMsgObj;
          this.tempMsgIds.set(tempMsgId, true);
        }
      } else {
        let msgObj = {};
        msgObj.id = message.messageId;
        msgObj.senderId = message.senderId;
        msgObj.content = message.text;
        msgObj.timestamp = message.timestamp;
        msgObj.date = message.date;
        this.addNewMessage(msgObj);
      }
    },
    handleGetRoomMessages(response) {
      console.log('currentRoomId : ' + this.currentRoom.roomId);
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
          this.updateUserDataOfMessage(msgObj);
          messages.push(msgObj);
        });

        // show message if has
        if(this.isResetRoom) {
          this.messages = messages;
        } else {
          this.messages = [...messages, ...this.messages]
        }
        if(messages.length == 0) {
          this.messagesLoaded = true;
        }
      } else {
        console.error(response);
      }
      this.setLoadingMsgStatus();
    },
    // frame work is error then temporary fix
    setLoadingMsgStatus() {
      this.isLoadingMsg = false;
      // if(this.messages.length == 0) {
      //   this.messagesLoaded = true;
      //   setTimeout(() => {
      //     this.messagesLoaded = false;
      //   }, 300);
      // }
    },
    roomActionHandler({ roomId, action }) {
      switch (action.name) {
        case 'archiveRoom':
        // call a method to archive the room
      }
    },
    sendMessage(message) {
      let tempMsgId = Nanoid.nanoid();
      this.tempMsgIds.set(tempMsgId, false);

      let dateNow = commonUtils.getDateNowHaiNoi();
      let timestamp = dateNow.toString().substring(16, 21);
      let date = dateNow.toDateString();

      let request = {
        tempMessageId: tempMsgId,
        senderId: this.currentUserId,
        roomId: this.currentRoom.roomId,
        text: message.content,
        timestamp: timestamp,
        date: date,
      }
      let headersObj = this.headerWSAuth();
      clientSockJs.publish({
        destination: '/chatroom/send.room.message',
        body: JSON.stringify(request),
        headers: headersObj,
      });

      message.id = tempMsgId;
      message.senderId = this.currentUserId;
      message.timestamp = timestamp;
      message.date = date;
      this.addNewMessage(message)
    },
    addNewMessage(message) {
      let msgObj = {
        _id: message.id,
        content: message.content,
        senderId: message.senderId,
        timestamp: message.timestamp,
        date: message.date
      }
      this.updateUserDataOfMessage(msgObj);
      this.messages = [...this.messages, msgObj];
    },
    updateUserDataOfMessage(msgObj) {
      let user = this.mapUsers.get(msgObj.senderId);
      if(commonUtils.isObjectNotNull(user)) {
        msgObj.username = user.username;
        msgObj.avatar = user.avatar;
      } else {
        msgObj.username = 'Anonymous';
        msgObj.avatar = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Star-icon.png';
      }
    }
  }
}
