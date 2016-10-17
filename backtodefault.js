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
    }
}, function(sinusbot, config) {
    if (!config.defaultChannel) {
        log('Invalid default channel');
        return;
    }

    
    sinusbot.on('clientCount', function(ev) {
        if (ev.count <= 1 ) {
            log('Returning to default channel ');
            join(config.defaultChannel);
            return;
        }
    });

    log('Back To Default initialized...');
});
