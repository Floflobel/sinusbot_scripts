registerPlugin({
	name: 'MyGroupAssigner',
	version: '1.0',
	description: 'Adds a anyone group with bot',
	author: 'Floflobel',
	vars: {
		a_groups: {
			title: 'Comma Seperated List of Group IDs wich may be affected',
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
		d_command: {
			title: 'The command, which should be used to remove the group.',
			type: 'string'
		}
	}
}, 	function(sinusbot, config) {
		sinusbot.on('chat', function(ev) {
			
			var chatMessage = ev.msg;
			var args = chatMessage.split(" ");
			var groupexist = 'False';
			
			if(ev.mode < 3 && args[1].length >= 1 && (args[0] == config.c_command || args[0] == config.d_command )) {
				var srvgroups = ev.clientServerGroups;
				if(config.c_command == args[0]) {
					for (var k in srvgroups) {
						if (srvgroups[k].i == args[1]) {
							sinusbot.log('already group assign');
							return;
						}
					}
					sinusbot.addClientToServerGroup(ev.client.dbid, args[1]);
					sinusbot.log('test');
					//sinusbot.poke(ev.clientId, config.b_message.replace(/%n/g, ev.clientNick));
					return;
				}
				else if(config.d_command == args[0]) {					
					for (var k in srvgroups) {
						if (srvgroups[k].i == args[1]) {
							groupexist = 'True';
						}
					}
					if(groupexist == 'True') {
						sinusbot.removeClientFromServerGroup(ev.client.dbid, args[1]);
						sinusbot.log('test');
						//sinusbot.poke(ev.clientId, config.b_message.replace(/%n/g, ev.clientNick));
					}
					else {
						sinusbot.log('False')
					}
				}
			}
			else {
				sinusbot.log('error');
				return;
			}
		});
	});