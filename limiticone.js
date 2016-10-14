registerPlugin({
	name: 'LimitIcone',
	version: '1.0',
	description: 'Limit icone',
	author: 'Floflobel',
	vars: {
		limit: {
			title: 'Set the limit of Server Groups',
			type: 'number',
			placeholder: "5"
		}
		optionmessage: {
			title: 'Select the type of prevent',
			type: 'select',
			options: [
				'No Message',
				'Message',
				'Poke (max. 100 characters)'
			]
		}
		message: {
			title: 'Set the message for prevent',
			type: 'string',
			placeholder: ""
		}
		exclude_groups: {
            title: 'Comma Seperated List of Group IDs which are exclude to remove and count',
            type: 'string'
        },
		punition: {
			title: 'Select the punition',
			type: 'select',
			options: [
				'Remove lastest group',
				'Kick',
				'Ban'
			]
		}
		timetopunition: {
			title: 'Set the time to punition is applie (seconds)',
			type: 'number',
			placeholder: "60"
		}
	}
}, 	function(sinusbot, config) {
		sinusbot.on('clientMove', function(ev) {
			var srvgroups = ev.clientServerGroups
			if(ev.oldChannel == 0) {
				var count = 0;
				for (var k in srvgroups) {
					if (srvgroups.hasOwnProperty(k)) {
						++count;
					}
				}
			sinusbot.log("'" + ev.clientNick + "' is connected. Number of groups: " + count);
			}
			
			if(count > config.limit) {	
				if (config.optionmessage == 0) {
					return;
				}
				else if (config.optionmessage == 1) {
					sinusbot.chatPrivate(ev.clientId, config.message)
				}
				else if (config.optionmessage == 2) {
					message = config.message.substring(0, 100);
					sinusbot.poke(ev.clientId, message);
				}
				
			}
		});
	});