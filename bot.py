import os
import asyncio

import discord
from discord.ext import commands
import interactions as int

from dotenv import load_dotenv

#Create .env in the main folder with variable "TOKEN=xxxxxxxxxxx" with "xxxxxxxx" is your token
#VARIABLE
serverID=653689680906420235


load_dotenv() #Load environement variable 

TOKEN = os.getenv('TOKEN')
client = int.Client(token=TOKEN)

# Define indent use by bot
intents = discord.Intents.default()
intents.members = True
intents.message_content = True

@client.command(
    name="start",
    description="Start the monopoly",
    scope=serverID #Your server ID
)
@commands.has_permissions(administrator=True) #Permission for command
async def _start(ctx: commands.Context):
    await ctx.send("LET'SS GOOOOO!")

@client.event
async def on_ready():
    print("Ready!")


#Connect bot to Discord
client.start()