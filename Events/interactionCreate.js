const Discord = require('discord.js');

module.exports = async (bot, interaction) => {

    // If it's slash command
    if(interaction.type === Discord.InteractionType.ApplicationCommand) {
        // Then take the command name 
        let command = require(`../Commands/${interaction.commandName}`)
        //Run the command
        command.run(bot, interaction, command.options);
    }
}