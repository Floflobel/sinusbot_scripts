registerPlugin({
    name: 'Back To Default',
    version: '1.1',
    description: 'If everyone leaves the current channel, the bot will move back to its default channel',
    author: 'XoXFaby <xoxfaby@gmail.com>, Floflobel',
    vars: {
        defaultChannel: {
            title: 'Default channel to return to',
            type: 'channel'
        }
		couldown: {
			title: 'Set the time to the bot are move (milliseconds)',
			type: 'number',
			placeholder: "60"
		}
		excludebot {
			title: 'Select option for exclude bot',
			type: 'select',
			options: [
				'Server Group ID',
				'Identity',
			]
		}
		servergroupid {
			title: 'Insert the Server Group ID of your bot (if selected)'
			type: 'number'
		}
    }
}, function(sinusbot, config) {
	//Example
	// for(var i = 0; i < allchannel.length; i++){
          // for (var client = 0; client < allchannel[i].clients.length; client++) {
            // if(allchannel[i].clients[client].uid == ev.clientUid) {
              // nickname = allchannel[i].clients[client].nick;
              // clients = allchannel[i].clients;
             // }
          // }
	// }
	
    if (!config.defaultChannel) {
        log('Invalid default channel');
        return;
    }

    sinusbot.on('clientCount', function(ev) {
	// Function for get uid of user in channel
	for(i=0; i<ev.count; i++) {
                sinusbot.log(sinusbot.getChannel(sinusbot.getCurrentChannelId())['clients'][i]['uid']);
        }
        if (ev.count <= 1 ) {
			if (!config.couldown || config.couldown == 0) {
				sinusbot.log('Returning to default channel ');
				join(config.defaultChannel);
				return;
			}
			else {
				if (config.couldown <= 1000) {
					config.couldown = 1000;
				}
				
				setTimeout(function() {
					var numberusers = sinusbot.getChannel(getCurrentChannelId()).clients;
	                                var countnumberusers = 0;
                	                for (var k in numberusers) {
                                        	++countnumberusers;
                                	}

					if (countnumberusers <= 1)
					{
						sinusbot.log('test2 : ' + ev.count)
						join(config.defaultChannel);
						return;
					}
					else
					{
						return;
					}
				}, config.couldown);
			}
        }
    });

    log('Back To Default initialized...');
});
