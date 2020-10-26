import urllib.request
from PIL import Image,ImageTk
from io import BytesIO
import discord
import os

class guild:
    def __init__(self,name,icon):
        self.icon=icon
        self.name=name





async def build(obj:discord.Guild):
    name = obj.name
    icon = None
    print(guild.__dict__)
    return guild(name,icon)


def debugObj(obj):
    print(obj)
    print(obj.__dict__)
    print(type(obj))

