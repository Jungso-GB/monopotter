// COMMAND A FIX

const Discord = require('discord.js');

const simulatedGuild = {
  id: '653689680906420235',
  name: 'JungsoParty',
};

module.exports = {
  name: 'dev',
  description: 'Dev utils during development!',
  permissions: ['ADMINISTRATOR'], // Modifier les permissions en conséquence
  dm: false,
  category: 'Development',
  options: [
    {
      type: 'STRING',
      name: 'event',
      description: 'event to dev',
      required: false,
      autocomplete: true,
    },
  ],

    async run(bot, interaction, args) {
        
        let command;
        if (interaction.options.getString('event') == 'join') {
          bot.emit('guildCreate', simulatedGuild);
        }

    // If don't put command. So general help
    if(!command) {
        console.log(command)
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

