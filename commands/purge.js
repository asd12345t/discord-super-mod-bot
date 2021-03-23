// npmjs packages
const Discord = require('discord.js');

// configuration
const config = require('../config.json');

// export command
module.exports = {
    
    // command name
	name: 'purge',

    // command description
	description: 'Purge messages in channel.',

    // command
	execute(message, args) {
        
        // amount of messages
        let amount = 0;

        if (!args[0]) {

            // set amount
            amount = 0

        // if args
        } else {

            // set amount to args
            amount = args[0]
        };

        // if amount higher than 100
        if (amount > 100) {

            // set amount
            amount = 100
        };

        // if no amount
        if (amount < 1) {

            // send message to channel
            message.channel.send(

                // embed
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Missing args!')
                .setDescription('You need to give a number of messages to purge!')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );

            // cancel
            return;
        };

        // purge messages
        message.channel.bulkDelete(amount, true);
        
        // send message to channel
        message.channel.send(

            // embed
            new Discord.MessageEmbed()
            .setColor(config.color.green)
            .setTitle('Successful purge!')
            .setDescription(`${message.author} successful purged ${amount} messages!`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
	},
};