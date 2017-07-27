registerPlugin({
	name: 'H1Z1 KOTH Server Information',
	version: '1.0.0',
	description: 'Shows information about most steam player on a channel description or via privat chat.',
	author: 'Floflobel',
	vars: [
		{
			name: 'interval',
			title: 'Update Interval in minutes',
			indent: 2
			type: 'number',
			placeholder: 5
		},
		{
			name: 'Solo 1',
			title: 'Solo 1',
			indent: 2,
			type: 'channel',
		},
		{
			name: 'Solo 2',
			title: 'Solo 2',
			indent: 2,
			type: 'channel',
		},
		{
			name: 'Solo 3',
			title: 'Solo 3',
			indent: 2,
			type: 'channel',
		},
		{
			name: 'Duo 1',
			title: 'Duo 1',
			indent: 2,
			type: 'channel',
		},
		{
			name: 'Duo 2',
			title: 'Duo 2',
			indent: 2,
			type: 'channel',
		},
		{
			name: 'Duo 3',
			title: 'Duo 3',
			indent: 2,
			type: 'channel',
		},
		{
			name: 'Five 1',
			title: 'Five 1',
			indent: 2,
			type: 'channel',
		},
		{
			name: 'Five 2',
			title: 'Five 2',
			indent: 2,
			type: 'channel',
		},
		{
			name: 'Five 3',
			title: 'Five 3',
			indent: 2,
			type: 'channel',
		},
		{
			name: 'Training',
			title: 'Training',
			indent: 2,
			type: 'channel',
		},
	]
   
}, function(sinusbot, config) {
	var event = require('event');
	var store = require('store');
    var backend = require('backend');
    var engine = require('engine');
	
	var nameGame = ['Solo 1', 'Solo 2', 'Solo 3', 'Duos 1', 'Duos 2', 'Duos 3', 'Five 1', 'Five 2', 'Five 3', 'Training'];
	//var nameGame = ['Solo 1', 'Solo 2', 'Solo 3'];
	
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
                    processData(sinusbot, serverInformation);
                } else {
              engine.log("ERROR: invalid response: " + response.data);
            }
          }
        });
    }
	
	function processData(sinusbot, serverInformation){
		for (var i in nameGame) {
			sinusbot.engine('Channel ID: ' + config[nameGame[i]);
			var channel = backend.getChannelByID(config[nameGame[i]]);
			var query = serverInformation.h1z1xx.Europe[nameGame[i] + " (EU)"]["status"];
			var name = nameGame[i] + " (EU)" + " > " + query;
			channel.setName(name);
		}
    }

});
