import random
import tkinter as tk
import typing

import discord

import BotClient.tools
from BotClient import tools

class guildBotton(tk.Button):
    def __init__(self, guildObj: BotClient.tools.guild, master=None):
        super().__init__(master, height=5, width=15)
        self.guildObj = guildObj
        self.name = self.guildObj.name

        self.config(text=self.name, wraplength=80)
        self.pack(padx=2, pady=3, side=tk.TOP)


class channelBottom(tk.Button):
    def __init__(self, channelObj: BotClient.tools.channel, master=None):

        super().__init__(master,text=channelObj.name, width=15)
        self.channelObj = channelObj
        self.pack(padx=2, pady=3, side=tk.TOP)


class Guild_List_frame(tk.Frame):
    def __init__(self, guild_list: dict, master=None):
        super().__init__(master, width=300, height=100, highlightbackground="black", highlightthickness=3)

        self.list_of_guilds = list(guild_list.values())

        self.guild_buttons = []


        self.label = tk.Label(master=self,text="Guilds | Servers")

        self.label.pack(side=tk.TOP)
        self.createWidgets()

        self.pack(side=tk.LEFT, anchor="nw", fill=tk.Y)

    def test(self):
        pass

    def createWidgets(self):


        for i in self.list_of_guilds:
            self.guild_buttons.append(guildBotton(master=self, guildObj=i))



class channel_header(tk.Frame):
    def __init__(self,root):
        super().__init__(master=root)
        self.config(height=20,bg="cyan")

        self.channel_name = tk.Label(master=self,text=" # "+root.channelObj.name)
        self.channel_name.pack(side=tk.LEFT,padx=2,pady=2)


        self.pack(side=tk.TOP,anchor="nw",fill=tk.X)


class message_label(tk.Label):
    def __init__(self,master,msg:discord.Message):
        super().__init__(master)

        txt = f"[{msg.author.name}] {msg.content}"

        self.config(text=txt,height=1,width=100,anchor="w")
        self.pack(side=tk.TOP,anchor="nw",fill=tk.X)




class channel_text_container(tk.Frame):
    def __init__(self,root):
        super().__init__(master=root)
        self.config(bg="grey")
        self.master.channelObj.on_msg_callback = self.add_line

        self.pack(side=tk.LEFT,anchor="nw",expand=1,fill=tk.BOTH)


        self.messages=[]


    def add_line(self, msg:discord.Message):
        self.messages.append(message_label(self, msg))
        pass




class ChannelContents(tk.Frame):
    def __init__(self,master,channel:BotClient.tools.channel):
        super().__init__(master)
        self.config(bg='yellow')
        self.channelObj = channel
        self.header = channel_header(self)
        self.actual_content=channel_text_container(self)

    def switch(self):
        self.master.switch_channel_to(self)

    def c_pack(self):
        self.pack(side=tk.LEFT,anchor="nw",expand=1,fill=tk.BOTH)



class ChannelContents_Container_frame(tk.Frame):


    def __init__(self,root):
        super().__init__(master=root)
        self.config(width=300,height=300,bg="pink")
        self.channel_contents=[self.create_content_frames(i) for i in root.channel_frame.text_channels_buttons]


        self.current=None
        self.pack(side=tk.LEFT,anchor="nw",expand=1,fill=tk.BOTH)



    def create_content_frames(self,i):
        tmp = ChannelContents(master=self,channel=i.channelObj)
        i.config(command=tmp.switch)
        return tmp




    def switch_channel_to(self,channel_frame):
        if self.current != None:
            self.current.pack_forget()

        self.current=channel_frame
        self.current.c_pack()

        pass

class GuildChannelsListFrame(tk.Frame):
    def __init__(self, master):
        super().__init__(master=master)
        self.config(width=150, bg=random.choice(["red", "blue", "green"]))

        self.text_channels_buttons=[self.construct_buttons(i) for i in list(self.master.guild.channels.values())]



        self.pack(side=tk.LEFT, anchor="nw", fill=tk.Y)


    def construct_buttons(self,i):
        return channelBottom(i,master=self)








class GuildContents(tk.Frame):
    def __init__(self, master, guild_button: guildBotton):
        super().__init__(master, width=500, height=300, highlightbackground="blue", highlightthickness=3)
        self.visible = False

        self.guild_button = guild_button
        self.guild_name = guild_button.name
        self.guild = self.guild_button.guildObj

        self.channel_frame = GuildChannelsListFrame(master=self)
        self.channel_contents = ChannelContents_Container_frame(self)


        self.c_pack()
        self.pack_forget()

        # Frames for the guild

    def switch(self):
        self.master.request_switch_content(self)

    def c_pack(self):
        self.pack(side=tk.LEFT, anchor="nw", expand=1, fill=tk.BOTH)


class GuildContentMasterFrame(tk.Frame):
    def __init__(self, root, client):
        super().__init__(master=root, width=500, height=250, bg="green")
        self.pack(side=tk.LEFT, anchor="nw", expand=1, fill=tk.BOTH)

        self.client = client
        self.current = None

        self.guild_contents = [self.create_content_frame(i) for i in root.guild_list_content_frame.guild_buttons]

    def request_switch_content(self, frame_to_switch_too):
        if self.current != None:
            self.current.pack_forget()
        self.current = frame_to_switch_too
        frame_to_switch_too.c_pack()

    def create_content_frame(self, i):
        tmp = GuildContents(self, i)
        i.config(command=tmp.switch)
        return tmp




class BotApplication(tk.Tk):
    def __init__(self, bot_client, screenName=None, baseName=None, className='Tk', useTk=1, sync=0, use=None):
        super().__init__(screenName, baseName, className, useTk, sync, use)

        self.client = bot_client
        self.guild_list_content_frame = None
        self.create_widgets()

    def create_widgets(self):
        self.guild_list_content_frame = Guild_List_frame(guild_list=self.client.guilds, master=self)
        self.guild_content_frame = GuildContentMasterFrame(self, self.client)
