const {
	Plugin
} = require('powercord/entities');
const {
	getModule,
	channels: {
		getChannelId,
	},
	FluxDispatcher: Dispatch,
} = require('powercord/webpack');

const Settings = require('./components/settings');
let listenerStatus = false;

class quickChatReply extends Plugin {
	constructor() {
		super()

		this.keyPressHandler = this._keyPressHandler.bind(this);
		this.createReply = this._createReply.bind(this);
		this.overhaulCurrentChannel = this._overhaulCurrentChannel.bind(this);
		this.overhaulCurrentReply = this._overhaulCurrentReply.bind(this);
		this.messageUpdater = this._messageUpdater.bind(this);
		this.noification_Popup = this.settings.get('Notification-Popup', true);
	}

	filter(matchfrom, matchto) {
		return Object.keys(matchfrom).every((value,) => { 
			return typeof matchfrom[value]==='string'?matchfrom[value].toUpperCase()===matchto[value].toUpperCase():matchfrom[value]===matchto[value] });
	};

	_keyPressHandler(keyInput) {
		if ( !this.message.channel ) {
			const c = getChannelId();
			this.message.channel = c;
			this.cache.channel = this.fetch.channel( c );
		}
		if ( this.filter(this.settings.get('replyNext'), keyInput) ) {
			const l = this.fetch.message( this.message.channel ).toArray().length;
			if ( this.message.index+1 < l ) {
				this.message.index++;
				this.createReply();
				this.newMessageListen(true);
			}
			else if ( this.noification_Popup&&!powercord.api.notices.toasts['quickChatReply-Max!Reply?Limit']&&this.message.index+1===l ) {
				powercord.api.notices.sendToast( 
					'quickChatReply-Max!Reply?Limit', 
					{
						header: 'Notice!',
						timeout: 5000,
						content: `You have reached the current loaded message limit of: ${l}.\nTo reply to furthur up messages please scroll up.`,
						buttons: [{text:'Disable Forever',look:'filled',size:'small',onClick:()=>{this.settings.set('Notification-Popup', false); this.noification_Popup= !this.noification_Popup; powercord.api.notices.closeToast('quickChatReply-Max!Reply?Limit');}},{text:'Dismiss',look:'filled',size:'small',onClick:()=>{powercord.api.notices.closeToast('quickChatReply-Max!Reply?Limit');}},],
					}
				);
			}
		} 
		else if ( this.filter(this.settings.get('replyPrev'), keyInput) ) {
			this.message.index--;
			if (this.message.index < 0) {
				this.message.index=-1;
				this.removeReply();
			} 
			else {
				this.createReply();
			}
		}
	}

	_createReply() {
		this.reply.create({
			message: this.fetch.message(this.message.channel).toArray().reverse()[this.message.index],
			channel: this.cache.channel,
			shouldMention: this.settings.get('mention', true),
			showMentionToggle: ((this.cache.channel.guild_id !== null) || false)
		})
	}

	removeReply() {
		this.reply.remove(this.message.channel);
	}

	_overhaulCurrentChannel(dat) {
		if (this.message.channel !== dat.channelId) {
			this.removeReply();
			this.newMessageListen(false);
			this.message = { index: -1, channel: dat.channelId };
			this.cache.channel = this.fetch.channel(this.message.channel);
		}
	}

	_overhaulCurrentReply(dat) {
		if (dat.type === 'CREATE_PENDING_REPLY') {
			this.message.index = this.fetch.message(this.message.channel).toArray().reverse().findIndex((e,)=>{return e.id===dat.message.id});
			this.newMessageListen(true);
		}
		else if (dat.type === 'DELETE_PENDING_REPLY') {
			this.newMessageListen(false);
			this.message = { index: -1, channel: this.message.channel, };
		}
	}

	newMessageListen( b ) {
		if ( listenerStatus === b ) return;
		if ( b ) Dispatch.subscribe('MESSAGE_CREATE', this.messageUpdater); 
		else if ( !b ) Dispatch.unsubscribe('MESSAGE_CREATE', this.messageUpdater);
		listenerStatus=!listenerStatus;
	}

	_messageUpdater( m ) {
		if ( m.channelId === this.message.channel )
			this.message.index++;
	}

	startPlugin() {
		const { createPendingReply, deletePendingReply } = getModule(['createPendingReply',], false);
		const { getChannel } = getModule(['getChannel', 'hasChannel',], false);
		const { getMessages } = getModule(['initialize', 'getRawMessages',], false);

		this.cache = { channel: undefined, };
		this.message = { index: -1, channel: undefined, };
		this.fetch = { message: getMessages, channel: getChannel, };
		this.reply = { create: createPendingReply, remove: deletePendingReply, };

		/* Settings */
		this.settings.set('replyNext', this.settings.get('replyNext', {ctrlKey: true, shiftKey: false, altKey: false, metaKey: false, key: 'ArrowUp'}));
		this.settings.set('replyPrev', this.settings.get('replyPrev', {ctrlKey: true, shiftKey: false, altKey: false, metaKey: false, key: 'ArrowDown'}));
		this.settings.set('mention', this.settings.get('mention', true));
		powercord.api.settings.registerSettings(this.entityID, {
			category: this.entityID,
			label: 'Quick Chat Reply',
			render: Settings,
		});

		/* Listeners */
		window.addEventListener('keydown', this.keyPressHandler);
		Dispatch.subscribe('CHANNEL_SELECT', this.overhaulCurrentChannel);
		Dispatch.subscribe('CREATE_PENDING_REPLY', this.overhaulCurrentReply);
		Dispatch.subscribe('DELETE_PENDING_REPLY', this.overhaulCurrentReply);
	}

	pluginWillUnload() {
		window.removeEventListener('keydown', this.keyPressHandler);
		Dispatch.unsubscribe('CHANNEL_SELECT', this.overhaulCurrentChannel);
		Dispatch.unsubscribe('CREATE_PENDING_REPLY', this.overhaulCurrentReply);
		Dispatch.unsubscribe('DELETE_PENDING_REPLY', this.overhaulCurrentReply);
		Dispatch.unsubscribe('MESSAGE_CREATE', this.messageUpdater); // More of a double check system
		powercord.api.settings.unregisterSettings(this.entityID);
	}
}

module.exports = quickChatReply;
