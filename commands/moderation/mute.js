// npmjs packages
const Discord = require('discord.js');

// configuration
const config = require('../../config.json');

// export command
module.exports = {
    
    // command name
	name: 'mute',

    // command description
	description: 'Mute a member in the server.',

    // guild only
    guildOnly: true,

    // perms
	permissions: 'KICK_MEMBERS',

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
                .setDescription('You need to mention a member to mute!')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );

            // cancel
            return;
        };

        // if owner to mute
        if (member.id === message.guild.ownerID) {

            // send message to channel
            message.channel.send(

                // embed
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Error!')
                .setDescription('You can not mute the server owner!')
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );

            // cancel
            return;
        };

        // if message author to mute
        if (member.id === message.author.id) {

            // send message to channel
            message.channel.send(

                // embed
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Error!')
                .setDescription('You can not mute yourself!')
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

        // reason
        const reason = args.slice(1).join(' ') || 'No reason...';

        // mute role
        let role = message.guild.roles.cache.find(r => r.name === 'Muted');

        // if no role
        if (!role) {

            // create role
            role = message.guild.roles.create({

                // role data
                data: {

                    // name
                    name: 'Muted',

                    // permissions
                    permissions: 0 // 0 = no perms
                }
            });

            // overwrite channel permissions
            message.guild.channels.cache.forEach(c => c.createOverwrite(role, {

                // permissions
                SEND_MESSAGES: false, // can not send messages to channels
                CONNECT: false, // can not connect to voice channels
                ADD_REACTIONS: false // can not add reactions to messages
            }));
        };

        // mute member
        member.roles.add(role);

        // send message to channel
        message.channel.send(

            // embed
            new Discord.MessageEmbed()
            .setColor(config.color.green)
            .setTitle(`Successful mute!`)
            .setDescription(`${member} got muted by ${message.author}!`)
            .addField('Reason', `\`\`\`${reason}\`\`\``)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
	},
};