<template>
	<div>
		<vue-advanced-chat
			:current-user-id='currentUserId'
			:menu-actions='JSON.stringify(menuActions)'
			:message-actions='JSON.stringify(messageActions)'
			:message-selection-actions='JSON.stringify(messageSelectedActions)'
			:messages='JSON.stringify(messages)'
			:messages-loaded='messagesLoaded'
			:room-actions='JSON.stringify(roomActions)'
			:rooms='JSON.stringify(rooms)'
			:rooms-loaded='true'
			height='calc(100vh - 20px)'
			@send-message='sendMessage($event.detail[0])'
			@fetch-messages='fetchMessages($event.detail[0])'
			@room-action-handler='roomActionHandler'
		/>
	</div>
</template>

<script>
import { register } from 'vue-advanced-chat'
// import { register } from '../../vue-advanced-chat/dist/vue-advanced-chat.es.js'
register()

export default {
	data() {
		return {
			currentUserId: '1234',
			rooms: [
				{
					roomId: '1',
					roomName: 'Room 1',
					avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
					users: [
						{ _id: '1234', username: 'John Doe' },
						{ _id: '4321', username: 'John Snow' }
					]
				}
			],
			messages: [],
			messagesLoaded: false,
			roomActions: [
				{ name: 'inviteUser', title: 'Invite User' },
				{ name: 'removeUser', title: 'Remove User' },
				{ name: 'deleteRoom', title: 'Delete Room' }
			],
			menuActions: [
				{
					name: 'inviteUser',
					title: 'Invite User'
				},
				{
					name: 'removeUser',
					title: 'Remove User'
				},
				{
					name: 'deleteRoom',
					title: 'Delete Room'
				}
			],
			messageActions: [
				{
					name: 'replyMessage',
					title: 'Reply'
				},
				{
					name: 'editMessage',
					title: 'Edit Message'
				},
				{
					name: 'deleteMessage',
					title: 'Delete Message'
				},
				{
					name: 'selectMessages',
					title: 'Select'
				}
			],
			messageSelectedActions: [
				{
					name: 'deleteMessages',
					title: 'Delete'
				},
				{
					name: 'forwardMessages',
					title: 'Forward'
				}
			]
		}
	},

	methods: {
		roomActionHandler({ roomId, action }) {
			alert(action)
		},
		fetchMessages({ options = {} }) {
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

		addMessages(reset) {
			const messages = []

			for (let i = 0; i < 30; i++) {
				messages.push({
					_id: reset ? i : this.messages.length + i,
					content: `${reset ? '' : 'paginated'} message ${i + 1}`,
					senderId: '4321',
					username: 'John Doe',
					date: '13 November',
					timestamp: '10:20'
				})
			}

			return messages
		},

		sendMessage(message) {
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
