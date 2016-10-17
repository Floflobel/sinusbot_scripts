registerPlugin({
    name: 'Back To Default',
    version: '1.0',
    description: 'If everyone leaves the current channel, the bot will move back to its default channel',
    author: 'XoXFaby <xoxfaby@gmail.com>',
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
    }
}, function(sinusbot, config) {
    if (!config.defaultChannel) {
        log('Invalid default channel');
        return;
    }

    sinusbot.on('clientCount', function(ev) {
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
					join(config.defaultChannel);
					return;
				}, config.couldown);
			}
        }
    });

    log('Back To Default initialized...');
});