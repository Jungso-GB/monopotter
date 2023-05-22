const Discord = require('discord.js');

module.exports = async (bot, interaction) => {

    //Autocomplete slash command
    if(interaction.type === Discord.InteractionType.ApplicationCommandAutocomplete) {
        let entry = interaction.options.getFocused() // Take the field entry when the typing
        command.log(interaction.commandName)
        if(interaction.commandName === "help") {

        //Choice in bot.comands then .filter
        //Show
        let choices = bot.comands.filter(cmd => cmd.name.includes(entry))
        //  Show                                If nothing is typed,                     
        await interaction.respond(entry === "" ? bot.commands.map(cmd => ({name: cmd.name, value: cmd.name})) : choices.map(choice => ({name: choice.name, value: choice.name})))

        }
    }
    // Slash command
    if(interaction.type === Discord.InteractionType.ApplicationCommand) {
        // Then take the command name 
        let command = require(`../Commands/${interaction.commandName}`)
        //Run the command
        command.run(bot, interaction, command.options);
    }
}