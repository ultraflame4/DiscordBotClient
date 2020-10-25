import discord
from threading import Thread
import asyncio
from . import gui



class MyClient(discord.Client):

    def __init__(self,ready_callbacks=[],*args,**kwargs):
        super().__init__(*args,**kwargs)

        self.onready_calls=ready_callbacks







    async def on_ready(self):
        print("Bot ready")

        for i in self.onready_calls:
            i()



class BotGUI:
    def __init__(self):
        self.bot = MyClient([self._onready_callback_dontuse])
        self.gui = None

        self.isready=False


    def _onready_callback_dontuse(self):
        print("bot is ready")
        self.isready = True


    def on_ready_watcher(self):
        print("waiting..")
        while True:
            if self.isready:break


    def run(self,token):
        loop = asyncio.get_event_loop()
        loop.create_task(self.bot.start(token))


        discordpy = Thread(target=loop.run_forever)
        discordpy.start()

        self.on_ready_watcher()
        print("Creating & Starting Gui..")
        self.gui=gui.BotApplication(guild_list=self.bot.guilds)
        self.gui.mainloop()

        loop.call_soon_threadsafe(loop.stop)
        discordpy.join()




