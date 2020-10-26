import discord
from threading import Thread

from . import gui,tools


class ConClient:
    def __init__(self):
        self.guilds = None


class MyClient(discord.Client):

    def __init__(self,*args,**kwargs):
        super().__init__(*args,**kwargs)
        self.fake = ConClient()







    def create_and_start_gui(self):
        self.gui = gui.BotApplication(self.fake)
        self.gui.mainloop()




    def create_gui(self):
        print("Creating G U I")

        guiThread = Thread(target=self.create_and_start_gui)
        guiThread.start()




    async def on_ready(self):
        print("Bot is ready")
        self.fake.guilds = [await tools.build(i) for i in self.guilds]
        self.create_gui()

        pass


class BotGUI:
    def __init__(self):
        self.bot = MyClient()

    def run(self,token=None):
        self.bot.run(token)



class BotGui_test:
    def __init__(self):
        pass
