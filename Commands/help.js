const Discord = require('discord.js');

module.exports = {

    name: "help",
    description: "Help about Monop Otter!",
    permission: "Aucune",
    dm: true,
    category: "User",
    options: [
        {
            type: "STRING",
            name: "command",
            description: "The command you want to get info about",
            required: false,
            autocomplete: true,
        }
    ],

    async run(bot, interaction, args){

        let command;
        console.log(interaction.options.getString("command"))

        if(interaction.options.getString("command")) {
            command = bot.commands.get(interaction.options.getString("command"));
            if(!command) return interaction.reply("Command not found");
    }

    // If don't put command. So general help
    if(!command) {
        let categories = []
        //For each command in "Commands" folder
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
        // We sort in each category
        categories.sort().forEach((cat) => {
            let commands = bot.commands.filter(cmd => cmd.category === cat);
            Embed.addFields({ name: `${cat}`, value: commands.map(cmd => `\`${cmd.name}\` : ${cmd.description}`).join("\n") });
        });

        await interaction.reply({embeds: [Embed]});
        // If user define a command
        } else {
            console.log(`Help on Commmand: ${command.name}`)
            let Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle(`Commmand ${command.name}`)
            .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
            .setDescription(`Name: \`${command.name}\`\nDescription: \`${command.description}\`\nPermission: \`${typeof command.permission !== "bigint" ? command.permission : new Discord.PermissionsBitField(command.permission).toArray(false)}\`\nDM Command: \`${command.dm ? "Yes" : "No"}\`\nCategory: \`${command.category}\``)
            .setTimestamp()
            .setFooter({ text: 'Command of Monop Otter'});

            await interaction.reply({embeds: [Embed]});
        }

    }
}

