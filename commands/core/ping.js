// npmjs packages
const Discord = require('discord.js');

// configuration
const config = require('../../config.json');

// export command
module.exports = {
    
    // command name
	name: 'ping',

    // command description
	description: 'Check the latency.',

    // command
	execute(message) {

        // send message to channel
        message.channel.send(

            // embed
            new Discord.MessageEmbed()
            .setColor(config.color.default)
            .setTitle('Bot Ping')
            .addField('Bot latency', `${Math.round(message.createdTimestamp / 10000000000)}ms`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
	},
};