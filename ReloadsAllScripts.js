registerPlugin({
	name: 'Reload All Scripts',
	version: '1.0.0',
	description: '',
	author: 'Floflobel',
	vars: [	]
   
}, function(sinusbot, config) {
	var event = require('event');
	var store = require('store');
	var backend = require('backend');
	var engine = require('engine');
	
	event.on('chat', function(ev){
		if (!ev.client.isSelf()) {
			var command = "!reload"
			if (ev.text.indexOf("!reload") == 0) {
				//store.set(ev.client.uid(), ev.text.split(" ").pop());
				ev.client.chat("Reloads all scripts !");
				reloadScripts();
				ev.client.chat("Reloads all scripts are done");
			}
        	}	
	});
});
