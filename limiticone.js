registerPlugin({
  name: 'LimitIcone',
  version: '1.0',
  description: 'Limit icone',
  author: 'Floflobel',
  vars: {
    limit: {
      title: 'Set the limit of Server Groups',
      type: 'number',
      placeholder: "Max ?"
    },
    option: {
      title: 'Select the punition',
      type: 'select',
      options: [
        'Message',
        'Poke'
      ]
    },
  }
}, function(sinusbot, config) {
    sinusbot.on('clientMove', function(ev) {
      var test = getServerGroups()
	  if(ev.oldChannel == 0) {
			sinusbot.log("'" + ev.clientNick + "' is connected. Checking for the server groups...");
			sinusbot.log("ServerGroup : " + test + ".");
	  }
  });
});