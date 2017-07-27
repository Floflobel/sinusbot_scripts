registerPlugin({
	name: 'H1Z1 KOTH Server Information',
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
			name: 'interval',
			title: 'Update Interval in minutes',
			//indent: 2,
			type: 'number',
			placeholder: 5
		},
		Channels {
			title: 'Channels'
			type: 'array'
			var: [
				{
					name: 'Solo 1',
					indent: 1,
					type: 'channel',
				}
				{
					name: 'Solo 2',
					indent: 1,
					type: 'channel',
				}
				{
					name: 'Solo 3',
					indent: 1,
					type: 'channel',
				}
			]
		}
	]
   
}, function(sinusbot, config) {
	var event = require('event');
	var store = require('store');
    var backend = require('backend');
    var engine = require('engine');
	
	var nameGame = ['Solo 1', 'Solo 2', 'Solo 3', 'Duos 1', 'Duos 2', 'Duos 3', 'Five 1', 'Five 2', 'Five 3', 'Training'];
	
	interval = config.interval * 60000;
    if (interval < 60000) {
        interval = 60000;
    }
	
	// if (!(config.apiKey)){
        // engine.log('No API key found - stop script execution!');
        // return;
    // }
	

	queryData()
	setInterval(queryData, interval);
	
	function queryData() {
        sinusbot.http({
          "method": "GET",
          "url":    'http://census.daybreakgames.com/json/status?game=h1z1xx',
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
                    processData(serverInformation);
                } else {
              engine.log("ERROR: invalid response: " + response.data);
            }
          }
        });
    }
	
	function processData(serverInformation){
		
		for (var nameofGame in nameGame) {
			
		}
		
		
		
		var duos1_status = serverInformation.h1z1xx.Europe["Duos 1 (EU)"]["status"];
		var duos1_live = serverInformation.h1z1xx.Europe["Duos 1 (EU)"]["ageSeconds"];
		
		backend.createChannel({ name: 'Duos 1 (EU) > ' + duos1_status + ' > ' + duos1_live + 's', 
								parent: config.Channel, 
								permanent: true, 
								//codec: parseInt(ChannelCodec), 
								//codecQuality: parseInt(parseInt(ChannelQuality) + 1), 
								maxClients: 0, 
								//description: ChannelDescription, 
								//neededTalkPower: parseInt(ChannelTalkPower)
								});
		
		engine.log(duos1_status);
		engine.log(duos1_live);
    }

});
