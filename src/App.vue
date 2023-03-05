<template>
  <div class="App">
    <div class="guild-list">

      <GuildList :guilds="guildList"/>

    </div>

    <div class="channels-header" data-hasbanner={!!openedGuild.bannerUrl}>
      <span v-text="openedGuild?.name ?? 'No guild open'"/>
    </div>
    <div class="channels-list">
<!--      <ChannelList guildId={openedGuild.id}-->
<!--                   guildBanner={openedGuild.bannerUrl}-->
<!--                   onSetCurrentChannel={setCurrentChannel}-->
<!--                   currentChannel={currentChannel}/>-->
    </div>
    <div class="user-info">

    </div>
    <div class="content-header" v-text="currentChannel?.name"/>

    <div class="content">
<!--      -->
<!--      {currentChannel?.type === "bot-home" &&-->
<!--      <BotHomeContent channel_id={currentChannel.id} on_requestLogin={LoginApi}-->
<!--                      authState={authStatus}/>}-->
    </div>
  </div>

</template>

<script lang="ts" setup>
import {provide, ref} from "vue";
import {BotHomeGuild} from "./utils";
import {AuthStatus} from "./api";
import GuildList from "./components/GuildList/GuildList.vue";

const guildList = ref<SimplifiedGuildInfo[]>([])
const openedGuild = ref<SimplifiedGuildInfo>(BotHomeGuild)

const currentChannel = ref<SimplifiedChannelInfo|null>(null)
const authStatus = ref<AuthStatus>(AuthStatus.LoggedOut)

provide("authStatus", authStatus)
provide("selectedGuild", openedGuild)


</script>

<style lang="scss" scoped>

.App {
  width: 100vw;
  height: 100vh;
  display: grid;

  grid-template-columns: 4em 14em auto;
  grid-template-rows: 3em auto 3em;
  grid-gap: 1px;

  font-family: "Poppins", "Open Sans", sans-serif;
  color: white;
  box-sizing: border-box;
  background: var(--bg-color);
}

.guild-list {
  grid-column: 1 / 2;
  grid-row: 1 / -1;
  background-color: var(--bg-color);

}

.channels-header {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  /*background-color: rgba(0, 0, 0, 0.32);*/
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.5rem;
  font-family: "Open Sans";
  display: flex;
  align-items: center;
  z-index: 1;
  border-top-left-radius: 0.5rem;
  border-bottom: 2px solid var(--bg-color);
}

.channels-header[data-hasbanner="true"] {
  border-color: transparent;
}

.channels-header span {
  filter: drop-shadow(1px 1px 2px black);
}

.channels-list {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
  background-color: var(--bg-color);
  border-top-left-radius: 0.5rem;

}


.user-info {
  grid-column: 2 / 3;
  grid-row: 3 / 4;
  background-color: var(--bg-color);
}

.content-header {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
  background-color: var(--bg-color);
}

.content {
  grid-column: 3 / 4;
  grid-row: 2 / -1;
  background-color: var(--bg-color);
}
</style>
