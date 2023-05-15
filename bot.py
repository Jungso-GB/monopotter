import discord
from discord.ext import commands

# Définir les Intents utilisés par le bot
intents = discord.Intents.default()
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix='!', intents=intents)

@bot.command(name='coucou')
async def coucou(ctx):
    await ctx.send('Bonjour')

bot.run('MTEwNjg1MDkwMDY4Mjc0Nzk3NA.GWVQyH.cQaZjpHz9L93B4Ma1Dtq-eHgupkUK75dpXgXb4')
