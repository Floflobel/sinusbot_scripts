registerPlugin({
	name: 'LimitIcone',
	version: '1.1',
	description: 'IconLimit',
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
			title: 'Set the message when Server Groups is superior of the limit',
			type: 'string',
			placeholder: ""
		}
		exclude_groups: {
            title: 'Comma Seperated List of Group IDs which are exclude to remove and count',
            type: 'string'
        },
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
				}
				else if (config.optionmessage == 1) {
					sinusbot.chatPrivate(ev.clientId, config.message)
				}
				else if (config.optionmessage == 2) {
					message = config.message.substring(0, 100);
					sinusbot.poke(ev.clientId, message);
				}
				
				for (var g in srvgroups) {
					for(var t in srvgroups) {
						if (srvgroups[g].i != srvgroupsfinalofexclude[t]) {
							sinusbot.removeClientFromServerGroup(ev.client.dbid, srvgroups[g].i);
							return;
						}
					}
				}
			}
		});
	});

