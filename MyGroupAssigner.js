registerPlugin({
	name: 'MyGroupAssigner',
	version: '1.0',
	description: 'Add group with command',
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
		e_limit: {
			title: 'Limit the number of group'
			type: 'number'
			placeholder: '5'
		}
		f_permission: {
			title: 'Comma Seperated List of Group IDs allow to assign group (if none, already assign group)'
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
	
				// Check the number of group with list of group may be affected
				var a_groups_exclude = new Array();
				a_groups_exclude = config.a_groups.split(',');
				
				var count_number_groups = 0;
				for (var k in srvgroups) {
					for (var j in a_groups_exclude)
					
						// count the number of group	
						if(srvgroups[k].i == a_groups_exclude[j]) {
							++count_number_groups;	
						}
				}
				
				// Command for add group
				if(config.c_command == args[0]) {
					
					if(count_number_groups > config.e_limit) {
						sinusbot.log('You have the maximum of the group, please remove group with command : ' + config.d_command);
						return;
					}
					else {
						sinusbot.log('Number of groups : ' + count_number_groups);
					}

					var a_groups_split = new Array();
					a_groups_split = config.a_groups.split(',');
						
					// Check if group is already assign 
					for (var k in srvgroups) {
						if (srvgroups[k].i == args[1]) {
							sinusbot.log('already group assign');
							return;
						}
						else {
							sinusbot.log('continue..')
						}
					}
					
					// Check if group is allowed to assign
					for (var j in a_groups_split) {
						if (a_groups_split[j] == args[1]) {
							sinusbot.addClientToServerGroup(ev.client.dbid, args[1]);
							sinusbot.log('test');
							//sinusbot.poke(ev.clientId, config.b_message.replace(/%n/g, ev.clientNick));
							return;
						}	
						else {
							sinusbot.log('group is not allowed to assign');
						}
					}
				}
				// Command for remove group 
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
				sinusbot.log('error or not permission');
				return;
			}
		});
	});
