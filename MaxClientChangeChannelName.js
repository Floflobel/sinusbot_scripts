registerPlugin({
	name: 'Max Client Change Channel Name',
	version: '1.0.0',
	description: '',
	author: 'Floflobel',
	vars: {
		eventGroups: {
			title: "Event Listener",
			type: "array",
			vars: {
				channelName: {
					name: 'channelName',
					title: 'channelName'
					indent: 2,
					type: "channel"
				},
			}
		},
		suffix: {
			title: "suffix",
			type: "string"
		}
	}


   
}, function(sinusbot, config) {
	var event = require('event');
	var store = require('store');
	var backend = require('backend');
	var engine = require('engine');
	
	event.on('clientMove', function(ev) {
		if (!config.eventGroups.length) {
			engine.log("Please define channel where is name change");
			return;
		}
		if (!config.suffix) {
			engine.log("Please define a suffix");
			return;
		}

		for(var i = 0; i < config.eventGroups.length; i++){
			engine.log('Maxclient: ' + ev.toChannel.maxClients() + ' - Currentclient: ' + ev.toChannel.getClientCount() + ' - Show channalName: ' + config.eventGroups[i].channelName + ' - To Channel: ' + ev.toChannel.id() );

			if (ev.toChannel.getClientCount() >= ev.toChannel.maxClients()) {
				if (config.eventGroups[i].channelName == ev.toChannel.id()) {
					engine.log("change name");
					ev.toChannel.setName(ev.toChannel.name() + " " + config.suffix);
				}
			}
		}

	});
});
