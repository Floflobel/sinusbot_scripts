registerPlugin({
	name: 'MyGroupAssigner',
	version: '1.0',
	description: 'Adds a anyone group with bot',
	author: 'Floflobel',
	vars: {
		a_groups: {
			title: 'Comma Seperated List of Group IDs which are exclude to remove and count',
			type: 'string'
		},
		b_message: {
			title: 'The message, which should be send, after the bot assigned the group. %n is the nickname of the Client.',
			type: 'multiline'
		},
		c_command: {
			title: 'The command, which should be used to assign the group.',
			type: 'string'
		}
	}
}, 	function(sinusbot, config) {
		sinusbot.on('chat', function(ev) {
			if(ev.msg == config.c_command && ev.mode == 2) {
				sinusbot.addClientToServerGroup(ev.client.dbid, config.a_group);
				sinusbot.poke(ev.clientId, config.b_message.replace(/%n/g, ev.clientNick));
			}
		});
	});