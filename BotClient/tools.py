import urllib.request

import typing
from PIL import Image,ImageTk
from io import BytesIO
import discord
import os


class message:
    def __init__(self):
        pass


class channel:
    def __init__(self,channel_obj:typing.Union[discord.TextChannel]):
        self.obj = channel_obj
        self.name=channel_obj.name
        self.id=channel_obj.id
        self.on_msg_callback=None
        self.h = []


    async def update_channel_with_history(self):
        async for message in self.obj.history(limit=20):
            self.h.insert(0,message)




    def on_message(self,msg):
        self.on_msg_callback(msg)
        pass


    def send(self,msg):
        pass



class guild:
    def __init__(self,obj:discord.Guild,name,icon):
        self._guild_obj=obj
        self.icon=icon
        self.name=name
        self.id = self._guild_obj.id
        self.channels={i.id : channel(i) for i in self._guild_obj.text_channels}

    async def firstUpdate(self):
        [await i.update_channel_with_history() for i in list(self.channels.values())]


async def build(obj:discord.Guild):
    name = obj.name
    icon = None
    g = guild(obj,name,icon)
    await g.firstUpdate()
    return g


def debugObj(obj):
    print(obj)
    print(obj.__dict__)
    print(type(obj))

