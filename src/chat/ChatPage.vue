<template>
  <div>
    <vue-advanced-chat
      :current-user-id='currentUserId'
      :messages='JSON.stringify(messages)'
      :messages-loaded='messagesLoaded'
      :messages-actions="JSON.stringify(messageActions)"
      :rooms='JSON.stringify(rooms)'
      :rooms-loaded='true'
      :room-actions='JSON.stringify(roomActions)'
      @room-action-handler='roomActionHandler($event.detail[0])'
      height='calc(100vh - 100px)'
      @send-message='sendMessage($event.detail[0])'
      @fetch-messages='fetchMessages($event.detail[0])'
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
      messageActions:[
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
      rooms: [
        {
          roomId: '1',
          roomName: 'Room 1',
          avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
          users: [
            {
              _id: '1234',
              username: 'John Doe',
              avatar: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Star-icon.png',
              status: {
                state: 'online',
                lastChanged: 'today, 14:30'
              }
            },
            {
              _id: '4321',
              username: 'John Snow',
              avatar: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Star-icon.png',
              status: {
                state: 'online',
                lastChanged: 'today, 14:30'
              }
            },
            {
              _id: 'abc',
              username: 'John X',
              avatar: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Star-icon.png',
              status: {
                state: 'online',
                lastChanged: 'today, 14:30'
              }
            }
          ]
        },
        {
          roomId: '2',
          roomName: 'Room 2',
          avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
          users: [
            { _id: '1234', username: 'John Doe' },
            { _id: 'a2', username: 'John 2' }
          ]
        },
        {
          roomId: '3',
          roomName: 'Room 3',
          avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
          users: [
            { _id: '1234', username: 'John Doe' },
            { _id: 'b2', username: 'John 3' }
          ]
        }
      ],
      messages: [],
      messagesLoaded: false,
      WS_CHAT_URL: config.ws.rtm + '/ws/chat/websocket',
      currentPage: 0,
    }
  },
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  mounted() {
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
      roomService.getJoinedRooms(this.currentPage, this.handleGetJoinedRooms)
    },
    handleGetJoinedRooms(response) {
      console.log(response);
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
    getAccessToken() {
      return this.$store.state.account.user.token.accessToken;
    },
    getUserId() {
      return this.$store.state.account.user.userId;
    },
    connectCallback(data) {
      console.log('ok')
      console.log(data)
    },
    errorCallback(error) {
      console.log('error')
      console.log(error)
    },
    fetchMessages({ room, options = {} }) {
      setTimeout(() => {
        if (options.reset) {
          this.messages = this.addMessages(true)
        } else {
          this.messages = [...this.addMessages(), ...this.messages]
          this.messagesLoaded = true
        }
        // this.addNewMessage()
      })
    },
    roomActionHandler({ roomId, action }) {
      switch (action.name) {
        case 'archiveRoom':
        // call a method to archive the room
      }
    },
    addMessages(reset) {
      const messages = []
      for (let i = 0; i < 5; i++) {
        messages.push({
          _id: reset ? i : this.messages.length + i,
          content: `${reset ? '' : 'paginated'} message ${i + 1}`,
          senderId: '4321',
          username: 'John Snow',
          avatar: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Star-icon.png',
          date: '13 November',
          timestamp: '10:20'
        });
      }
      for (let i = 0; i < 5; i++) {
        messages.push({
          _id: reset ? i : this.messages.length + i,
          content: `${reset ? '' : 'paginated x'} message ${i + 1}`,
          senderId: 'abc',
          username: 'John X',
          avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRKZ80vPmz0MbQo9ErHoPXkGekhxcK38nm3w&usqp=CAU',
          date: '13 November',
          timestamp: '10:20'
        });
      }
      return messages
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
