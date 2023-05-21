const Discord = require('discord.js');

// Event for command by prefix and not slash

/*module.exports = async (bot, message) => {

    let prefix = "?"

    let messageArray = message.content.split(" ");
    let commandName = messageArray[0].slice(prefix.length);
    let args = messageArray.slice(1);

    if(!message.content.startsWith(prefix)) return;

    let command = require(`../Commands/${commandName}`);
    if(!command) return message.reply("This command doesn't exist!");

    command.run(bot, message, args);
}*/