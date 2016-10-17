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
			
			var srvgroupsfinalofexclude = {};
			
			
			if(ev.oldChannel == 0) {
				// Compte le nombre de groupe que le joueur à 
				var srvgroups = ev.clientServerGroups;
				var countuser = 0;
				for (var k in srvgroups) {
					if (srvgroups.hasOwnProperty(k)) {
						++countuser;
					}
				}
				
				// compte le nombre de groupe à exclure 
				var arrayexcludegroups = config.exclude_groups.split(',')
				var countexclude = 0;
				for(var j in arrayexcludegroups) {
					if (arrayexcludegroups.hasOwnProperty(k)) {
						++countexclude;
					}
				}
				
				// count the number of real group without excludegroup
				var count;
				var countfinal = 0;
				for (var h in srvgroups) {
					for(i = 0; i <= countexclude; i++) {
						if (srvgroups[h].i == arrayexcludegroups[i]) {
							++countfinal;
							srvgroupsfinalofexclude[countfinal-1] = arrayexcludegroups[i]
						}
					}
				}
				count = countuser - countfinal	
			}		
			
			// Message or poke with function of the group
			if(count > config.limit) {	
				if (config.optionmessage == 0) {
					return;
				}
				else if (config.optionmessage == 1) {
					sinusbot.chatPrivate(ev.clientId, config.message)
				}
				else if (config.optionmes-sage == 2) {
					message = config.message.substring(0, 100);
					sinusbot.poke(ev.clientId, message);
				}
				
				// Remove group without exclude_groups
				//randomnumber = getRandomIntInclusive(mingroup, maxgroup)
				//sinusbot.log('Debug random' + randomnumber)
				var removegroup = 31;
				for (var g in srvgroups) {
					for(i = 0; i <= countfinal; i++) {
						if (removegroup == srvgroupsfinalofexclude[g]) {
							
						}
						else {
							//sinusbot.log('Debug remove : ' + ev.clientId + ' - ' + removegroup)
							sinusbot.removeClientFromServerGroup(ev.clientIdi.dbId, removegroup)
						}
					}
				}
			}
			
			

		});
	});
	
	function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min +1)) + min;
	}
