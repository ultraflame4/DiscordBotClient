import discord
from threading import Thread
import asyncio
from . import gui



class MyClient(discord.Client):

    def __init__(self,ready_callbacks=[],*args,**kwargs):
        super().__init__(*args,**kwargs)


