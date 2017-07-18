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
	
	setInterval(queryData, interval);

	event.on('clientMove', function(ev) {
		
		var welcomechan	= ev.client.getChannels();
		if(ev.toChannel.id() == config.initialchannel) {
			initial_check_steamid(ev.client)
		} 
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
		client.chat("patate");
		clientsteamid = store.get(client.uid());
		if (clientsteamid == undefined || clientsteamid == "undefined") {
			client.chat("========== STEAM LINK ==========");
			client.chat("Pour effectuer le lien avec steam rend toi sur ton profil steam avec un navigateur et récupère la fin du lien (exemple: 76561198027575528");
			client.chat("Ou rend toi sur ce site [URL]https://steamid.eu[/URL] et met le pseudo avec lequel tu te connecte à steam pour récupèrer ton 'Community ID'");
			client.chat("Entre ton steamid en tapant " + config.steamidcommand + " 76561198027575528");
			
			client.getServerGroups().forEach(function(group) {
				if (group.id() == 20) {
					client.removeFromServerGroup(20);
				  	engine.log('User ' + client.name() + ' set Group id 20 ');
					return;
				}
			return;
			});
		}
		else {
			client.getServerGroups().forEach(function(group) {
				if (group.id() != 20) {
				  client.addToServerGroup(20);
				  engine.log('User ' + client.name() + ' set Group id 20 ');
				}
				check_game(client);
			});
		}

	}

	function check_steamid(client) {
	
	}

	function check_game(client) {
		//queryData(client)
		queryData(client, function(info) {
			// "info" here is now the serverInformation
			engine.log(info.response.player.personaname);
			client.chat(info);
		});
		//client.chat(processData.response.player[0].personaname);
		//var pseudo = queryData().response.players[0].personaname;
		//var ingame = queryData().response.players[0].gameextrainfo; // undefined
		//if (ingame == "H1Z1: King of the Kill") {
		//	client.addToServerGroup(22);
		//}
		//else if (ingame == undefined) {
		//	client.removeFromServerGroup(22);
		//	engine.log("remove");
		//}
	}

	
	function queryData(client, callback) {
		sinusbot.http({
		  "method": "GET",
		  "url":    'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + config.apiKey + '&steamids=' + clientsteamid,
		  "timeout": 6000,
		  "headers": [
			{"Content-Type": "application/json"}
		  ]
		}, function (error, response) {
			if (error) return engine.log("API Error: " + error);
			if (response.statusCode == 200) {
		        	try {
					var serverInformation = JSON.parse(response.data);
				} catch(e) {
					return engine.log("ERROR: invalid response: " + response.data);
		        	}
		        	if (typeof serverInformation.error != 'undefined') {
			            engine.log("API Error: " + serverInformation.error);
			        }
                
			        //engine.log("1: " + serverInformation);
			        //engine.log("2: " + serverInformation.response.player[0].personaname);
			        callback(serverInformation);
			}
		  
		});
	}

	
});

