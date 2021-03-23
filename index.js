// npmjs packages
const Discord = require('discord.js');
const fs = require('fs');

// configuration
const config = require('./config.json');

// create client
const client = new Discord.Client();

// const commands
client.commands = new Discord.Collection();

// commands folder
const commandFolders = fs.readdirSync('./commands');

// command folders from commands folder
for (const folder of commandFolders) {

    // command (category) folders
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    // commands
	for (const file of commandFiles) {

        // command files
		const command = require(`./commands/${folder}/${file}`);

        // push commands
		client.commands.set(command.name, command);
	};
};


// login with token
client.login(config.token);

// ready event
client.once('ready', () => {

    // write to console
	console.log(`I am logged in as ${client.user.tag} to Discord!`);

    // set activity
    client.user.setActivity(`${config.prefix}help • ${client.user.username.toUpperCase()}`, { type: "LISTENING" });
});

// message event // command handling
client.on('message', (message) => {
    
    // command without prefix
	if (!message.content.startsWith(config.prefix)) {

        // cancel
        return;
    };

    // if a bot execute a command
	if (message.author.bot) {

        // cancel
        return;
    };

    // get the args
	const args = message.content.slice(config.prefix.length).trim().split(/ +/);

    // const command
	const commandName = args.shift().toLowerCase();

    // command
    const command = client.commands.get(commandName);

    // if not match
	if (!command) {

        // send message to channel
        message.channel.send(
            
            // embed
            new Discord.MessageEmbed()
            .setColor(config.color.red)
            .setTitle('Unknown command')
            .setDescription(`Sorry, but no command match \`${command}\`!`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );

        // cancel
        return;
    };

    // only in guild
    if (command.guildOnly && message.channel.type === 'dm') {

        // send message to channel
        message.channel.send(

            // embed
            new Discord.MessageEmbed()
            .setColor(config.color.red)
            .setTitle('Error!')
            .setDescription('You can not execute this command in DMs!')
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );

        // cancel
        return;
    };

    // permissions
    if (command.permissions) {

        // author permissions
        const authorPerms = message.channel.permissionsFor(message.author);

        // if no permission
        if (!authorPerms || !authorPerms.has(command.permissions)) {
        	
            // send message to channel
            message.channel.send(

                // embed
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('No permission!')
                .setDescription(`You need the \`${command.permissions}\` permission(s)!`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
                .setTimestamp()
            );

            // cancel
            return;
        };
    };

    // try to executing the command
    try {

        // execute
		command.execute(message, args);

    // if error
	} catch (error) {

        // write to console
		console.error(error);

        // send message to channel
		message.channel.send(

            // embed
            new Discord.MessageEmbed()
            .setColor(config.color.red)
            .setTitle('Error occurred!')
            .setDescription(`An error occurred in \`${command}\` command!`)
            .addField('Error', `\`\`\`js\n${error}\n\`\`\``)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
            .setTimestamp()
        );
	};
});

// mute commands ==> mute role
client.on('channelCreate', (channel) => {

    // if DM
    if (!channel.guild) {

        // cancel
        return;
    };

    // mute role
    const muteRole = channel.guild.roles.cache.find(r => r.name === 'Muted');

    // if can not find
    if (!muteRole) {

        // cancel
        return;
    };

    // overwrite new channels permissions for mute role
    channel.createOverwrite(muteRole, {

        // permissions
        SEND_MESSAGES: false, // can not send messages to channels
        CONNECT: false, // can not connect to voice channels
        ADD_REACTIONS: false // can not add reactions to messages
    });
});