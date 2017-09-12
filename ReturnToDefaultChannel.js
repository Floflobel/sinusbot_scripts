registerPlugin({
    name: 'Defaultchannel+',
    version: '1.0',
    description: 'The bot moves itself back into an default channel if the current channel is empty. (With channel blacklist)',
    author: 'Diesmon <dontmindme12@web.de>',
    vars: [
            {
                name: 'defaultChannel',
                title: 'Default channel',
                type: 'channel'
            },
            {
                name: 'channelIgnore',
                title: 'Channels to ignore for moving back to default',
                type: 'array',
                vars: [
                        {
                            name: 'channel',
                            indent: 1,
                            title: 'Channel to ignore',
                            type: 'channel'
    	                }
                ]
            },
            {
                name: 'moveBotManual',
                title: 'Move bot back if he got moved into an empty channel?',
                type: 'checkbox'
            }
        ]
}, function(sinusbot, config) {
var event = require('event');
var engine = require('engine');
var backend = require('backend');

var currentChannel;
var defaultChannel;

var channelIgnore = [];
if(config.channelIgnore){
    channelIgnore = config.channelIgnore;
}

    event.on('clientMove', function(ev){
        if (ev.client.isSelf()) {
            if(ev.toChannel){
                if(config.moveBotManual && ev.toChannel.id() != config.defaultChannel){
                    if(ev.toChannel.getClientCount() == 1 && !checkIfIgnore(ev.toChannel)){
                        defaultChannel = backend.getChannelByID(config.defaultChannel);
                        if(defaultChannel){
                            backend.getBotClient().moveTo(defaultChannel);
                        }
                        else{
                            engine.log("The default channel is missing.");
                        }
                    }
                }
            }
            return;
        }
        if(ev.fromChannel && !ev.client.isSelf()){
            currentChannel = backend.getCurrentChannel();
            if(ev.fromChannel.id() == currentChannel.id() && !checkIfIgnore(currentChannel) && currentChannel.getClientCount() == 1 && ev.fromChannel.id() != config.defaultChannel){
                defaultChannel = backend.getChannelByID(config.defaultChannel);
                if(defaultChannel){
                    backend.getBotClient().moveTo(defaultChannel);
                }
                else{
                    engine.log("The default channel is missing.");
                }
            }
        }
    });

    function checkIfIgnore(channel){
        if(channelIgnore.length > 0){
            for(var i = 0; i < channelIgnore.length; i++){
                if(channelIgnore[i].channel == channel.id()){
                    return true;
                }
            }
        }
        return false;
    }
});
