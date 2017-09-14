registerPlugin({
    name: '!come',
    version: '1.2.0',
    backends: ['ts3'],
    engine: '>= 0.9.18',
    description: 'Implements the !come and !goaway command',
    author: 'Xuxe <julian@julian-huebenthal.de> & maxibanki <max@schmitt.mx>',
    vars: [{
        name: 'defaultChannel',
        title: 'Name or ID of the default channel (needed for !goaway)',
        type: 'channel'
    }, {
        name: 'clientUIDs',
        title: 'Allowed clients',
        type: 'array',
        vars: [{
            name: 'clientUID',
            title: 'Client Unique ID',
            type: 'string',
            placeholder: '+q726hsF9s4u/npIV0EslIZVqAw='
        }]
    }, {
        name: 'groupIDs',
        title: 'Allowed groups',
        type: 'array',
        vars: [{
            name: 'groupID',
            title: 'Group ID',
            type: 'string',
            placeholder: '12'
        }]
    }]
}, function (sinusbot, config) {
    var engine = require('engine');
    var backend = require('backend');
    var event = require('event');

    var defaultChannel = backend.getChannelByID(config.defaultChannel);

    event.on('chat', function (ev) {
        if (!ev.client.isSelf()) {

            var isInServerGroupList = false;
            var isInClientList = false;
            if (ev.text === '!goaway' || ev.text === '!come') {
                /**
                 * Checking if the current client has the permission to
                 * come by looping through the list of clients in the config
                 */
                if (config.clientUIDs) {
                    var clientUID = ev.client.uniqueID();
                    config.clientUIDs.some(function (e) {
                        if (e.clientUID === clientUID) {
                            isInClientList = true;
                            return true;
                        }
                    });
                }
                /**
                 * Checking if the current client has a servergroup of the
                 * servergroups which are given in the config by looping through
                 * both arrays
                 */
                if (config.groupIDs) {
                    ev.client.getServerGroups().some(function (group) {
                        var serverGroupID = group.id();
                        var found = config.groupIDs.some(function (e) {
                            if (e.groupID === serverGroupID) {
                                isInServerGroupList = true;
                                return true;
                            }
                        });
                        if (found) {
                            return true;
                        }
                    });
                }
            }
            switch (ev.text) {
                case '!goaway':
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
