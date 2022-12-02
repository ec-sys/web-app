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
      :loading-rooms="firstLoadingRoom"
      :text-messages='JSON.stringify(textMessages)'
      @room-action-handler='roomActionHandler($event.detail[0])'
      height='calc(100vh - 100px)'
      @send-message='sendMessage($event.detail[0])'
      @fetch-messages='fetchMessages($event.detail[0])'
      @fetch-more-rooms='fetchMoreRooms'
    />
  </div>
</template>

<script src='./chat-page.js'></script>

<style lang='scss'>
body {
  font-family: 'Quicksand', sans-serif;
}
</style>
