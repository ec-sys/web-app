import { register } from 'vue-advanced-chat'
import { Client, Message } from '@stomp/stompjs'
import { mapState } from 'vuex'
import { roomService } from '../_services'
import {handleFetchRooms} from './room.logic'
import { buildMessage, updateUserDataOfMessage } from './message.logic'

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
      tempMsgIds: new Set(),
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
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    })
    clientSockJs.configure();

    // connect to ws server
    clientSockJs.onConnect = this.sockJsConnectSuccess;
    clientSockJs.onStompError = this.sockJsConnectError;
    clientSockJs.activate();
  },
  methods: {
    headerWSAuth() {
      return commonUtils.getWSAuthHeader();
    },
    sockJsConnectSuccess(frame) {
      this.rooms = [];
      this.messages = [];
      this.getJoinedRooms();
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
        let rooms = handleFetchRooms(response);
        // show new rooms if has
        if(rooms.length > 0) {
          this.rooms = [...rooms, ...this.rooms];
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
        // open new room then clear new room data and relation data
        this.currentRoom = room;
        this.isResetRoom = true;
        this.messagesLoaded = false;

        this.mapUsers.clear();
        room.users.forEach((user) => {
          this.mapUsers.set(user._id, user);
        });

        this.currentPageMsg = 0;
        this.tempMsgIds.clear()

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
        // if send message by this then update again message from server data
        let updateMsgObj = undefined;
        let updateMsgIdx = 0;
        this.messages.forEach((item, index) => {
          if(item._id === tempMsgId) {
            updateMsgObj = item;
            updateMsgIdx = index;
            return;
          }
        });
        // found, update
        if(updateMsgObj != undefined) {
          updateMsgObj._id = message.messageId;
          this.messages[updateMsgIdx] = updateMsgObj;
          this.tempMsgIds.delete(tempMsgId);
        }
      } else {
        // if send message by other then add message from server data
        let msgObj = buildMessage(message);
        msgObj._id = message.messageId;
        msgObj.content = message.text;
        this.addNewMessage(msgObj);
      }
    },
    handleGetRoomMessages(response) {
      if(commonUtils.isResponseOK(response)) {
        let data = response.data;
        let messages = [];

        data.messageItems.forEach((msgItem) => {
          // room info
          let msgObj = buildMessage(msgItem);
          // room member info
          updateUserDataOfMessage(msgObj, this.mapUsers);
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
      this.tempMsgIds.add(tempMsgId);

      let dateNow = commonUtils.getDateNowHaiNoi();
      let timestamp = dateNow.toString().substring(16, 21);
      let date = commonUtils.getDateAndFullMonthName(dateNow);

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

      let msgObj = {
        _id: tempMsgId,
        content: message.content,
        senderId: this.currentUserId,
        timestamp: timestamp,
        date: date
      }
      this.addNewMessage(msgObj)
    },
    addNewMessage(msgObj) {
      updateUserDataOfMessage(msgObj, this.mapUsers);
      this.messages = [...this.messages, msgObj];
    }
  }
}
