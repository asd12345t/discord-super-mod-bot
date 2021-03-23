// npmjs packages
const Discord = require('discord.js');

// configuration
const config = require('../config.json');

// export command
module.exports = {
    
    // command name
	name: 'ban',

    // command description
	description: 'Ban a member from the server.',

    // command
	execute(message, args) {

        // get member
        const member = message.mentions.members.first();

        // no member
        if (!member) {

            // send message to channel
            message.channel.send(

                // embed
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Missing args!')
                .setDescription('You need to mention a member to ban!')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );

            // cancel
            return;
        };

        // if owner to ban
        if (member.id === message.guild.ownerID) {

            // send message to channel
            message.channel.send(

                // embed
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Error!')
                .setDescription('You can not ban the server owner!')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );

            // cancel
            return;
        };

        // if message author to ban
        if (member.id === message.author.id) {

            // send message to channel
            message.channel.send(

                // embed
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Error!')
                .setDescription('You can not ban yourself!')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );

            // cancel
            return;
        };

        // if higher role
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) {

            // send message to channel
            message.channel.send(

                // embed
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Error!')
                .setDescription('The mentioned member has higher role than your!')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );

            // cancel
            return;
        };

        // if not bannable
        if (!member.bannable) {

            // send message to channel
            message.channel.send(

                // embed
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Error!')
                .setDescription('I can not ban this user!')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );

            // cancel
            return;
        };

        // reason
        const reason = args.slice(1).join(' ') || 'No reason...';

        // send message to member
        member.send(

            // embed
            new Discord.MessageEmbed()
            .setColor(config.color.red)
            .setTitle(`Banned!`)
            .addField('Reason', `\`\`\`${reason}\`\`\``)
            .addField('Moderator', `${message.author}`)
            .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true }))
            .setTimestamp()
        );

        // ban member with reason
        member.ban({ reason });

        // send message to channel
        message.channel.send(

            // embed
            new Discord.MessageEmbed()
            .setColor(config.color.green)
            .setTitle(`Successful ban!`)
            .setDescription(`${member} got banned by ${message.author}!`)
            .addField('Reason', `\`\`\`${reason}\`\`\``)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
	},
};