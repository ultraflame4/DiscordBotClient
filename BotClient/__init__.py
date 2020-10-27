import asyncio

import traceback

import discord
from threading import Thread

from . import gui, tools


class EXITEXCEPTION(Exception): pass


class ConClient:
    def __init__(self):
        self.guilds = None


class MyClient(discord.Client):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fake = ConClient()
        self.do_stop = False
        self.loop.create_task(self.checkStop())
        self.coro_to_run = []

    async def on_message(self, msg: discord.Message):
        if msg.guild != None:
            g_id = msg.guild.id
            c_id = msg.channel.id
            g = self.fake.guilds[g_id]
            c = g.channels[c_id]
            c.on_message(msg)

    async def checkStop(self):
        await self.wait_until_ready()
        while not self.is_closed():
            for i in self.coro_to_run:
                try:
                    await i()
                except Exception:
                    traceback.print_exc()

            self.coro_to_run.clear()

            if self.do_stop:
                self.guiThread.join()

                self.loop.stop()
                break

            await asyncio.sleep(0.5)

    def create_and_start_gui(self):
        self.gui = gui.BotApplication(self.fake)
        self.gui.mainloop()

        self.do_stop = True

    def create_gui(self):
        print("Creating G U I")

        self.guiThread = Thread(target=self.create_and_start_gui)
        print(self.guiThread.name)
        self.guiThread.start()

    async def on_ready(self):
        print("Bot is ready")

        self.fake.guilds = {i.id: await tools.build(i, self) for i in self.guilds}
        self.create_gui()

        pass

    def run(self, *args, **kwargs):
        try:
            self.loop.run_until_complete(self.start(*args, **kwargs))
        except KeyboardInterrupt:
            self.loop.run_until_complete(self.logout())
            # cancel all tasks lingering
        finally:
            self.loop.close()


class BotGUI:
    def __init__(self):
        self.bot = MyClient()

    def run(self, token=None):
        self.bot.run(token)


class BotGui_test:
    def __init__(self):
        pass
