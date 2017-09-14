registerPlugin({
    name: '!come',
    version: '1.2.0',
    backends: ['ts3'],
    engine: '>= 0.9.18',
    description: 'Implements the !come and !back command',
    author: 'Xuxe <julian@julian-huebenthal.de> & maxibanki <max@schmitt.mx>',
    vars: [{
        name: 'defaultChannel',
        title: 'Name or ID of the default channel (needed for !back)',
        type: 'channel'
    }]
}, function (sinusbot, config) {
    var engine = require('engine');
    var backend = require('backend');
    var event = require('event');

    var defaultChannel = backend.getChannelByID(config.defaultChannel);

    event.on('chat', function (ev) {
        if (!ev.client.isSelf()) {
            switch (ev.text) {
                case '!back':
                        engine.log('Going back to my default channel (' + defaultChannel.name() + ').');
                        backend.getBotClient().moveTo(defaultChannel);
                    break;

                case '!come':
                        backend.getChannels().forEach(function (channel) {
                            var clients = channel.getClients();
                            clients.some(function (client) {
                                if (client.equals(ev.client)) {
                                    sinusbot.log('Going to client: ' + ev.client.name());
                                    backend.getBotClient().moveTo(channel);
                                }
                            });
                        });
                    break;
            }
        }
    });
});
