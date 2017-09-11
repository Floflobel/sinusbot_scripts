registerPlugin({
	name: 'Steam Player Information',
	version: '1.0.0',
	description: 'Shows information about most steam player on a channel description or via privat chat.',
	author: 'Floflobel',
	vars: [
		{
			name: 'apiKey',
			title: 'Your personal API Key - check the installation instructions if you dont know how to get one',
			type: 'string'
		},
		{
			name: 'steamidcommand'
			title: 'steamid command'
			type: 'string'
		},
		{
			name: 'initialtext'
			title: 'initial texte when user have not set the steam id'
			type: 'multiline'
		},
		{
			name: 'initialchannel'
			title: 'initial channel'
			type: 'channel'
		},
		{
			name: 'interval',
			title: 'Update Interval in minutes',
			//indent: 2,
			type: 'number',
			placeholder: 5
		},
	]
}, function(sinusbot, config) {
	var event = require('event');
	var store = require('store');
	var backend = require('backend');
	var engine = require('engine');
	
	var clientsteamid;
	var steamidcommand = "!steamid"

	interval = config.interval * 60000;
	if (interval < 60000) {
		interval = 60000;
	}
	
	if (!(config.apiKey)) {
	        engine.log('No API key found - stop script execution!');
        	return;
	}
	if (!(config.steamidcommand)) {
	        engine.log('No command for steamid defined - stop script execution!');
        	return;
	}
	if (!(config.initialchannel)) {
	        engine.log('No initial channel defined - stop script execution!');
        	return;
	}

	event.on('clientMove', function(ev) {
		initial_check_steamid(ev.client);
		//if(ev.fromChannel == null && ev.toChannel.isDefault()) {
		//	initial_check_steamid(ev.client);
		//}
	});
	
	event.on('chat', function(ev){
		if (ev.client.isSelf()) {
       		     return;
	        }
		if (ev.text.indexOf(config.steamidcommand) == 0) {
			store.set(ev.client.uid(), ev.text.split(" ").pop());
		}
	});
	

	function initial_check_steamid(client) {
		clientsteamid = store.get(client.uid());
		if (clientsteamid == undefined || clientsteamid == "undefined") {

			client.chat(config.initialtext);
			removeToServerGroup(client, '20');
			return;
		}
		else {
			addToServerGroup(client, '20');
			queryData(client);
		}

	}
		

	function queryData(client) {
		clientsteamid = store.get(client.uid());
		if (clientsteamid == undefined) {
			engine.log("Steamid undefined")
			return;
		}

		sinusbot.http({
		  "method": "GET",
		  "url":    'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + config.apiKey + '&steamids=' + clientsteamid,
		  "timeout": 6000,
		  "headers": [
			{"Content-Type": "application/json"}
		  ]
		}, function (error, response) {
			if (typeof response != 'undefined' && response.statusCode == 200) {
				var serverInformation = JSON.parse(response.data);
				if (typeof serverInformation != 'undefined' || serverInformation != undefined) { 
					if (typeof serverInformation.error != 'undefined') {
						engine.log("API Error: " + serverInformation.error);
					}
					engine.log("serverInformation");
					processData(serverInformation, client);
				} else {
					engine.log("ERROR: invalid response: " + response.data);
				}
		  	}
		});
	}


	// ====================================================================================
	// Problème car il ne récupère aucun client, il faudrait recharger tout les clients

	//queryData();
	//setInterval(queryData, interval);

	// ====================================================================================


	function processData(serverInformation, client){
		if (clientsteamid == undefined) {
			engine.log("Steamid undefined")
			return;
		}
		

		// ===================================================================================

		// DEBUG

		var pseudo = serverInformation.response.players[0].personaname;
		var ingame = serverInformation.response.players[0].gameextrainfo; // undefined
		
		engine.log("[SteamplayerInformation] pseudo: " + pseudo + " game: " + ingame);

		//ev.client.chat("[SteamplayerInformation] pseudo: " + pseudo + " game: " + ingame + " Description : " + ev.client.Description);
	
		// Not working
		//client.setDescription("Jeux: " + ingame);
		
		// ====================================================================================
		
		if(ingame == undefined) {
			removeToServerGroup(client, 22);
		}
		else if (ingame == "H1Z1: King of the Kill") {
			addToServerGroup(client, 22);
		}
	}

// ======================================================

// Function check if group exists
    function checkIfInServerGroup(client, groupToCheck){
        var serverGroups = client.getServerGroups();
        for (var serverGroup in serverGroups){
            if (serverGroups[serverGroup].id() == groupToCheck){
                return true;
            }
        }
        return false;
    }


// Function add group if not exists
	function addToServerGroup(client, groupToAdd) {
		 if (!checkIfInServerGroup(client, groupToAdd)){
			client.addToServerGroup(groupToAdd);
		}
	}


// Function remove group if exesits
	function removeToServerGroup(client, groupToRemove) {
		 if (checkIfInServerGroup(client, groupToRemove)){
			client.removeFromServerGroup(groupToRemove);
		}

	}




});
