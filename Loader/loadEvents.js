const fs = require('fs');

module.exports = async (bot) => {
        // Read each .js file in the Events folder
    fs.readdirSync("./Events").filter(f => f.endsWith(".js")).forEach(async file => {
        let event = require(`../Events/${file}`)
        //Remove .js extension to make a command
        bot.on(file.split(".js").join(""), event.bind(null, bot))
        console.log(`Loaded Event: ${file} successfully`)
        
        
    })
}