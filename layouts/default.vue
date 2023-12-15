<template>
  <v-app>
    <v-app-bar color="transparent" scroll-behavior="hide" flat>
      <v-spacer />
      <v-btn v-show="unloged" @click="login()" rounded variant="outlined" size="small" class="mr-2">

        Log in
      </v-btn>
      <v-btn v-show="!unloged" rounded to="/profile" >
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
    <v-bottom-navigation grow>
      <v-btn to="/"> <v-icon>mdi-home</v-icon> </v-btn>
      <v-btn to="/store"> <v-icon>mdi-store</v-icon> </v-btn>
      <v-btn to="/mapAdd"> <v-icon>mdi-bag-personal-outline</v-icon> </v-btn>
      <v-btn to="/tournaments"> <v-icon>mdi-trophy-variant-outline</v-icon> </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup>
import { useConnectWeb3 } from '~/composables/useConnectWeb3';

const unloged = ref(true)
const user = ref("")


onMounted(() => {
  login()
})


async function login() {
  if (!window.ethereum) {
    alert("MetaMask not installed  :(");
  } else {
    try {
      await useConnectWeb3()
      unloged.value = false
      user.value = window.ethereum.selectedAddress
    } catch (error) {
      alert("no login!!")
      unloged.value = true
    }
  }
}

</script>
