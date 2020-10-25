import discord
from threading import Thread
import asyncio
from . import gui



class MyClient(discord.Client):

    def __init__(self,ready_callbacks=[],*args,**kwargs):
        super().__init__(*args,**kwargs)



class BotGUI:
    def __init__(self):
        self.bot = MyClient([self._onready_callback_dontuse])



    def run(self,token):




