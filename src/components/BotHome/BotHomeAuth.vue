<template>
  <label for="token" >Token</label>
  <input type="password" placeholder="Enter Bot Api token" id="token" :disabled="_disabled()" ref="inpRef"/>
  <button :disabled="_disabled()" @click="loginClient">
  {{ getBtnContents() }}
  </button>

</template>

<script lang="ts" setup>

import {inject, ref, Ref} from "vue";
import {AuthStatus, discordApi} from "../../api";

const authState = inject("authStatus") as Ref<AuthStatus>;
const inpRef = ref(null) as Ref<HTMLInputElement|null>;


const _disabled = ()=>authState.value===AuthStatus.LoggedIn||authState.value===AuthStatus.LoggingIn

function getBtnContents() {
  switch (authState.value) {
    case AuthStatus.LoggedIn:
      return "Logged In";
    case AuthStatus.LoggingIn:
      return ".  .  .";
    case AuthStatus.LoggedOut:
      return "Login";
  }
}


function loginClient() {
  authState.value = AuthStatus.LoggingIn
  discordApi.login(inpRef.value?.value??"").then(success=>{
    if(success){
      authState.value = AuthStatus.LoggedIn
    }else{
      alert("Login Failed! Check your token and try again.")
      authState.value = AuthStatus.LoggedOut
    }
  })

}



</script>

<style lang="scss">

</style>
