<template>
  <v-app>
    <v-app-bar color="transparent" scroll-behavior="hide" flat>
      <v-btn to="/" rounded>
        <v-icon  color="grey"> mdi-home </v-icon>
      </v-btn>
      <v-spacer />
      <v-btn v-show="unloged" @click="login()" rounded variant="outlined" size="small" class="mr-2">

        Log in
      </v-btn>
      <v-btn v-show="!unloged" rounded >
        <v-icon color="grey"> mdi-account </v-icon>
        {{
          user.slice(0, 5) +
          "..." +
          user.slice(-3)
        }}
      </v-btn>
    </v-app-bar>
    <v-main>
      <slot />
      
    </v-main>
  </v-app>
</template>

<script setup>
const unloged = ref(true)
const user = ref("")

async function login() {
  if (!window.ethereum) {
    alert("MetaMask not installed  :(");
  } else {
    try {
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      unloged.value = false
      user.value = window.ethereum.selectedAddress
    } catch (error) {
      alert("no login!!")
      unloged.value = true
    }
  }
}

</script>
