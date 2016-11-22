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
			


			var srv_groupsfinalofexclude = {};
			
			if(ev.oldChannel == 0) {
				// Compte le nombre de groupe serveur que le joueur a
				var srv_groups = ev.clientServerGroups;
				var count_group_user = 0;
				for (var k in srv_groups) {
					if (srv_groups.hasOwnProperty(k)) {
						++count_group_user;
					}
				}
				
				// Split les groupes à exclure 
				var arrayexcludegroups = config.exclude_groups.split(',');
				
				// Compte le nombre de groupe à excluse
				var countexclude = 0;
				for(var j in arrayexcludegroups) {
					if (arrayexcludegroups.hasOwnProperty(k)) {
						++countexclude;
					}
				}
				
				// Compte le nombre de groupe en enlevant les groupes exclus 
				var count;
				var countfinal = 0;
				for (var h in srv_groups) {
					for(i = 0; i <= countexclude; i++) {
						if (srv_groups[h].i == arrayexcludegroups[i]) {
							++countfinal;
							srv_groupsfinalofexclude[countfinal-1] = arrayexcludegroups[i]
							sinusbot.log('ArrayxExcludGroups : ' + arrayexcludegroups[i]);
							//sinusbot.log('Exclude group ID : ' + srv_groupsfinalofexclude[i] + ' CountFinal : ' + countfinal);
						}
					}
				}
				count = count_group_user - countfinal
				sinusbot.log('Count : ' + count);	
			}		
			
			// Message ou poke puis suppression d'un groupe 
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
			
								
				// Le problème vient de là
				// Il faut générer un nombre aléatoire entre les groupes a supprimer pour les vérifier un par un 	
				for (var g in srv_groups) {
					for(var t in arrayexcludegroups) {
						if (srv_groups[g].i != arrayexcludegroups[t]) {
							//sinusbot.removeClientFromServerGroup(ev.client.dbid, srv_groups[g].i);
							//sinusbot.log('Delete1 : ' + srv_groups[g].i);
							//sinusbot.log('Delete2 : ' + arrayexcludegroups[t]);
							//return;
						}
					}
					//if (tmp == false) {
						//sinusbot.removeClientFromServerGroup(ev.client.dbid, srv_groups[g].i);
						
					//}
				}
			}
		});
	});

