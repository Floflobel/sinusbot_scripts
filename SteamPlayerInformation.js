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
		var processData = queryData(client);
		client.chat(processData.response.player[0].personaname);
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


        function TwitchSpecialEmotesResp(name) {
                sinusbot.http({
                        "method": "GET", 
                        "url":"https://api.twitch.tv/kraken/chat/"+name+"/emoticons" + "?response_type=token&client_id=" + config.twitch_apikey, 
                        "timeout": 60000, 
                        "headers":[{"Content-Type": "application/json","Client-ID": config.twitch_apikey}, {"Accept":"application/vnd.twitchtv.v3+json"}]
                }, function (error, response) {
                        if (response.statusCode != 200) {
                                sinusbot.log(error);
                                return;
                        }
                        
                        var data = JSON.parse(response.data);
                        subemotes = 'no SUB emotes';
                        var emotes = '';
                        for (var i = 0; i < data.emoticons.length; i++) {
                                if (data.emoticons[i].subscriber_only == true) {
                                        emotes = emotes + '\n[img]'+data.emoticons[i].url+'[/img] '+data.emoticons[i].regex;
                                }
                        }
                        if (emotes != '') {
                                subemotes = emotes;
                        }
                        
                        key = sinusbot.getVar(name);
                        
                        sinusbot.setVar(name, {
                                lastState: key.lastState,
                                SpecialInfo: parseInt(key.SpecialInfo),
                                mode: parseInt(key.mode),
                                channelId: parseInt(key.channelId),
                                OfflineText: key.OfflineText,
                                OnlineText: key.OnlineText,
                                description: key.description,
                                descriptionsetet: key.descriptionsetet,
                                imgshow: key.imgshow,
                                subemotes: subemotes,
                                Betteremotes: key.Betteremotes
                        });
                });
        }

	
	function queryData(client) {
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
				if (typeof serverInformation != 'undefined') { 
					if (typeof serverInformation.error != 'undefined') {
						engine.log("API Error: " + serverInformation.error);
					}
					//processData(serverInformation);
/					client.chat("1: " + serverInformation);
					client.chat("2: " + serverInformation.response.player[0].personaname);
					return serverInformation;
				} else {
			  engine.log("ERROR: invalid response: " + response.data);
			}
		  }
		});
	}
	
});
