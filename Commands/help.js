const Discord = require('discord.js');

module.exports = {

    name: 'help',
    description: 'Help about Monop Otter!',
    permission: "Aucune",
    dm: true,
    category: "Information",
    options: [
        {
            type: "string",
            name: "command",
            description: "The command you want to get info about",
            required: false,
        }
    ],
    
    async run(bot, message, args){

        let command;
        if(args["command"]) {
            command = bot.commands.get(args.args["command"]);
            if(!command) return message.reply("Command not found");
    }
    // If don't put command. So general help
    if(!command) {
        let categories = []
        bot.commands.forEach(command => {
            // We put the category if it's not already in the array
            if(!categories.includes(command.category)) categories.push(command.category)
        })

        let Embed = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setTitle("Command of Monop Otter")
        .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
        .setDescription(`Available commands: \`${bot.commands.size}\`\nAvailable categories: \`${categories.length}\``)
        .setTimestamp()
        .setFooter({ text: 'Command of Monop Otter'});

        categories.sort().forEach((cat) => {
            let commands = bot.commands.filter(cmd => cmd.category === cat);
            Embed.addFields({ name: `${cat}`, value: commands.map(cmd => `\`${cmd.name}\` : ${cmd.description}`).join("\n") });
        });

        await message.reply({embeds: [Embed]});
        }
    }
}

