const fs = require('fs');

module.exports = async (bot) => {
    // Read each .js file in the Commands folder
    fs.readdirSync("./Commands").filter(f => f.endsWith(".js")).forEach(async file => {

        let command = require(`../Commands/${file}`)
        // Check if the command has a name
        if(!command.name || typeof command.name !== "string") throw new TypeError(`Command ${file.slice(0, file.length - 3)} have no name`)
            //Load the command in the bot
            bot.commands.set(command.name, command)
            console.log(`Command + ${file} + successfully loaded`)
        
    })
}