const {
	Plugin
} = require('powercord/entities');
const {
	getModule,
	channels: {
		getChannelId,
	},
	FluxDispatcher: Dispatch,
	constants: {
		ActionTypes: {
			CREATE_PENDING_REPLY: createReply,
			DELETE_PENDING_REPLY: removeReply,
			CHANNEL_SELECT: selectChannel,
		},
	},
} = require('powercord/webpack');

const Settings = require('./components/settings');

class quickChatReply extends Plugin {
	constructor() {
		super()

		this.keyPressHandler = this._keyPressHandler.bind(this)
		this.createReply = this._createReply.bind(this)
		this.overhaulCurrentChannel = this._overhaulCurrentChannel.bind(this)
		this.overhaulCurrentReply = this._overhaulCurrentReply.bind(this)
	}

	filter(matchfrom, matchto) {
		return Object.keys(matchfrom).every((value,) => { return matchfrom[value] === matchto[value] })
	}

	_keyPressHandler(keyInput) {
		if (this.filter(this.settings.get('replyNext'), keyInput)) {
			if (this.message.index + 1 < this.fetch.message(this.message.channel).toArray().length) {
				this.message.index += 1
				this.createReply()
			}
		} else if (this.filter(this.settings.get('replyPrev'), keyInput)) {
			this.message.index -= 1
			if (this.message.index < 0) {
				this.message.index = -1
				this.removeReply()
			} else {
				this.createReply()
			}
		}
	}

	_createReply() {
		const channel = this.fetch.channel(this.message.channel)
		const message = this.fetch.message(this.message.channel).toArray().reverse()[this.message.index]
		this.reply.create({
			message: message,
			channel: channel,
			shouldMention: this.settings.get('mention', true),
			showMentionToggle: (channel.guild_id !== null)
		})
	}

	removeReply() {
		this.reply.remove(this.message.channel)
	}

	_overhaulCurrentChannel(dat) {
		if (this.message.channel === dat.channelId) return;
		else {
			this.message = { index: -1, channel: dat.channelId }
		}
	}

	_overhaulCurrentReply(dat) {
		if (dat.type === createReply) {
			if (dat.id !== this.message.id)
				this.message.id === dat.id;
		} else if (dat.type === removeReply) {
			this.message = { index: -1, channel: this.message.channel }
		}
	}

	startPlugin() {
		const { createPendingReply, deletePendingReply } = getModule(['createPendingReply'], false)
		this.reply = { create: createPendingReply, remove: deletePendingReply }
		const { getChannel } = getModule(['getChannel', 'hasChannel'], false)
		const { getMessages } = getModule(['initialize', 'getRawMessages'], false)
		this.fetch = { message: getMessages, channel: getChannel }
		this.message = { index: -1, channel: getChannelId() }

		this.settings.set('replyNext', this.settings.get('replyNext', { ctrlKey: true, shiftKey: false, altKey: false, metaKey: false, code: 'ArrowUp' }))
		this.settings.set('replyPrev', this.settings.get('replyPrev', { ctrlKey: true, shiftKey: false, altKey: false, metaKey: false, code: 'ArrowDown' }))
		// Listeners
		window.addEventListener('keydown', this.keyPressHandler)
		Dispatch.subscribe(selectChannel, this.overhaulCurrentChannel)
		Dispatch.subscribe(createReply, this.overhaulCurrentReply)
		Dispatch.subscribe(removeReply, this.overhaulCurrentReply)
		powercord.api.settings.registerSettings(this.entityID, {
			category: this.entityID,
			label: 'Quick Chat Reply',
			render: Settings
		})
	}

	pluginWillUnload() {
		window.removeEventListener('keydown', this.keyPressHandler)
		Dispatch.unsubscribe(selectChannel, this.overhaulCurrentChannel)
		Dispatch.unsubscribe(createReply, this.overhaulCurrentReply)
		Dispatch.unsubscribe(removeReply, this.overhaulCurrentReply)
		powercord.api.settings.unregisterSettings(this.entityID)
	}
}

module.exports = quickChatReply
