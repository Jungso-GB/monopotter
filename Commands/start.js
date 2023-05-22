const Discord = require('discord.js');

module.exports = {

    name: 'start',
    description: 'Start the Monop Otter!',
    permission: "Aucune",
    category: "Game",
    dm: false,
    /*options: [
        {
            autocomplete: false,
        }
    ],*/
    
    async run(bot, message){

        await message.reply('Starting Monop Otter...');
    }

}
