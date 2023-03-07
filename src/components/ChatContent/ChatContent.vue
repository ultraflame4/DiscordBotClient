<template>
  <div class="chat-content">
    <ul class="messages-container">
      <Message v-for="msg in messages" :msg="msg" :key="msg.id"/>
    </ul>
    <div class="chat-input">
      <input :placeholder="`Send stuff to # ${props.channel.name}`"/>
      <button>Send</button>
    </div>

  </div>
</template>

<script lang="ts" setup>

import {GuildMessages} from "../../utils";
import {discordApi} from "../../api";
import Message from "./Message.vue";

const props = defineProps<{
  channel:SimplifiedChannelInfo
}>()


const messages = GuildMessages.useRef<SimplifiedMessageItem[]>(()=>`guildmsg-${props.channel.id}`,[],(ref)=>{
  discordApi.getChannelMessages(props.channel.id).then(value => {
    ref.value=value
  })
},[()=>props.channel.id])


</script>

<style lang="scss" scoped>
.chat-content{
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-direction: column;


}
.chat-input{
  position: sticky;
  bottom: 0;
  margin: 0;
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  filter: drop-shadow(0 3px 3px black);
}
.chat-input>input{
  box-sizing: border-box;
  flex-grow: 1;
  height: fit-content;
}
.chat-input>button{
  margin-top: 0;
  position: static;
}

.messages-container{

  flex-grow: 1;
  list-style-type: none;
  padding: 0 1rem;
  margin: 0;
  min-height: fit-content;
  overflow: visible;
  box-sizing: border-box;

}
</style>
