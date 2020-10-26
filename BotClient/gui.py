import base64
import random
import tkinter as tk
import urllib.request

import discord
import typing
import io
from urllib.request import urlopen

import BotClient.tools


class guildBotton(tk.Button):
    def __init__(self, guildObj: BotClient.tools.guild, master=None):
        super().__init__(master,height=5,width=15)
        self.guildObj=guildObj
        self.name=self.guildObj.name


        self.config(text=self.name,wraplength=80)
        self.pack(padx=2,pady=3,side=tk.TOP)


class Guild_List_frame(tk.Frame):
    def __init__(self,guild_list:typing.List[BotClient.tools.guild], master=None):
        super().__init__(master, width=300,height=100,highlightbackground="black",highlightthickness=3)

        self.list_of_guilds = guild_list

        self.guild_buttons=[]

        self.createWidgets()

        self.pack(side=tk.LEFT,anchor="nw",fill=tk.Y)

    def test(self):



    def createWidgets(self):

        for i in self.list_of_guilds:


            self.guild_buttons.append(guildBotton(master=self,guildObj=i))



class GuildChannelsFrame(tk.Frame):
    def __init__(self,master):
        super().__init__(master=master)
        self.config(width=150, bg=random.choice(["red","blue","green"]))




        self.pack(expand=1,side=tk.LEFT,anchor="nw",fill=tk.Y)








class GuildContents(tk.Frame):
    def __init__(self,master,guild_button:guildBotton):
        super().__init__(master, width=500, height=300, highlightbackground="blue", highlightthickness=3)
        self.visible = False


        self.guild_button = guild_button
        self.guild_name = guild_button.name
        self.guild = self.guild_button.guildObj
        self.label = tk.Label(master=self,text=self.guild_name,bg="red")
        self.label.pack()
        self.channel_frame = GuildChannelsFrame(master=self)


        self.c_pack()
        self.pack_forget()




        # Frames for the guild




    def switch(self):
        self.master.request_switch_content(self)

    def c_pack(self):

        self.pack(side=tk.LEFT, anchor="nw",expand=1,fill=tk.BOTH)



class GuildContentMasterFrame(tk.Frame):
    def __init__(self,root,client):
        super().__init__(master=root,width=500,height=250,bg="green")
        self.pack(side=tk.LEFT,anchor="nw",expand=1,fill=tk.BOTH)

        self.guild_contents = [self.create_content_frame(i) for i in root.guild_list_content_frame.guild_buttons]
        self.client = client
        self.current=None





    def request_switch_content(self,frame_to_switch_too):
        if self.current!=None:
            self.current.pack_forget()
        self.current=frame_to_switch_too
        frame_to_switch_too.c_pack()



    def create_content_frame(self,i):
        tmp = GuildContents(self,i)
        i.config(command=tmp.switch)
        return tmp



class BotApplication(tk.Tk):
    def __init__(self, bot_client,screenName=None, baseName=None, className='Tk', useTk=1, sync=0, use=None):
        """

        :param guild_list: List of discord.py guild objects
        :param screenName:
        :param baseName:
        :param className:
        :param useTk:
        :param sync:
        :param use:
        """
        super().__init__(screenName, baseName, className, useTk, sync, use)

        self.client = bot_client
        self.guild_list_content_frame = None
        self.create_widgets()




    def create_widgets(self):

        self.guild_list_content_frame = Guild_List_frame(guild_list=self.client.guilds, master=self)
        self.guild_content_frame=GuildContentMasterFrame(self, self.guild_list_content_frame)



