// npmjs packages
const Discord = require('discord.js');

// configuration
const config = require('../config.json');

// export command
module.exports = {
    
    // command name
	name: 'unban',

    // command description
	description: 'Unban a member in the server.',

    // command
	execute(message, args) {

        // get member
        const member = args[0];

        // no member
        if (!member) {

            // send message to channel
            message.channel.send(

                // embed
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Missing args!')
                .setDescription('You need to give a member\'s id to unban!')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );

            // cancel
            return;
        };

        if(isNaN(member)) {

            // send message to channel
            message.channel.send(

                // embed
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle(`Unban error!`)
                .setDescription('The id can not contain letters or punctuation!')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );

            // cancel
            return;
        };

        // try to fetch ban
        try {

            // fetch
            message.guild.fetchBans();

            // unban
            message.guild.members.unban(member);

        // can not unban
        } catch (error) {

            // write to console
            console.log(error);

            // if error
            if (error) {

                // send message to channel
                message.channel.send(

                    // embed
                    new Discord.MessageEmbed()
                    .setColor(config.color.red)
                    .setTitle(`Unban error!`)
                    .setDescription(`I can not unban ${member}!`)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                    .setTimestamp()
                );

                // cancel
                return;
            };
        };

        // send message to channel
        message.channel.send(

            // embed
            new Discord.MessageEmbed()
            .setColor(config.color.green)
            .setTitle(`Successful unban!`)
            .setDescription(`<@${member}> got unbanned by ${message.author}!`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
	},
};