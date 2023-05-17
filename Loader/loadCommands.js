const fs = require('fs');

module.exports = async (bot) => {
    fs.readdirSync("./Commands").filter(f => f.endsWith(".js")).forEach(async file => {
        
        let command = require(`../Commands/${file}`)
        if(!command.name || typeof command.name !== "string") throw new TypeError(`Command ${file.slice(0, file.length - 3)} have no name`)
            bot.commands.set(command.name, command)
            console.log(`Command " + ${file} + "successfully loaded`)
        
    })
}