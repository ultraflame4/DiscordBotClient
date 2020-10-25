import base64
import tkinter as tk
import urllib.request

import discord
import typing
import io
from urllib.request import urlopen


class guildBotton(tk.Button):
    def __init__(self,guildObj:discord.Guild,master=None):
        super().__init__(master,height=2)
        self.guildObj=guildObj
        self.name=self.guildObj.name


        self.config(text=self.name)
        self.pack(padx=2,pady=3,side=tk.TOP)


class GuildsList(tk.Frame):
    def __init__(self,guild_list:typing.List[discord.Guild], master=None):
        super().__init__(master, width=300,height=100,highlightbackground="black",highlightthickness=3)

        self.list_of_guilds = guild_list

        self.guild_buttons=[]

        self.createWidgets()

        self.pack(side=tk.LEFT,anchor="nw")

    def test(self):
        print("Test")


    def createWidgets(self):
        print("TE")
        for i in self.list_of_guilds:


            self.guild_buttons.append(guildBotton(master=self,guildObj=i))


class GuildContents(tk.Frame):
    def __init__(self,master,guild_button:guildBotton):
        super().__init__(master, width=500, height=300, highlightbackground="blue", highlightthickness=3)
        self.visible = False


        self.guild_button = guild_button
        self.guild_name = guild_button.name
        self.guild = self.guild_button.guildObj
        self.label = tk.Label(master=self,text=self.guild_name,bg="red")
        self.label.pack()
        self.c_pack()
        self.pack_forget()


        # Frames for the guild




    def switch(self):
        self.master.request_switch_content(self)

    def c_pack(self):

        self.pack(side=tk.LEFT, anchor="nw",expand=1,fill=tk.BOTH)



class GuildContentMasterFrame(tk.Frame):
    def __init__(self,root,guild_list:GuildsList):
        super().__init__(master=root,width=500,height=250,bg="green")
        self.pack(side=tk.LEFT,anchor="nw",expand=1,fill=tk.BOTH)

        self.guild_contents = [self.create_content_frame(i) for i in guild_list.guild_buttons]
        self.guild_list = guild_list
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
    def __init__(self, guild_list,screenName=None, baseName=None, className='Tk', useTk=1, sync=0, use=None):
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

        self.Guilds=guild_list




        self.create_widgets()

    def create_widgets(self):
        print(type(self.Helper))
        self.guilds_list = GuildsList(guild_list=self.Guilds,master=self)
        self.guild_content_frame=GuildContentMasterFrame(self,self.guilds_list)