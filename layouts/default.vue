<template>
  <v-app>
    <v-app-bar color="transparent" scroll-behavior="hide" flat>
      <v-btn to="/" rounded>
        <v-icon  color="grey"> mdi-home </v-icon>
      </v-btn>
      <v-spacer />
      <v-btn v-show="!unloged" rounded>
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
    <v-dialog v-model="unloged" persistent>
        <v-card width="300" class="mx-auto">
          <v-card-text class="text-center">
            <div> Welcome to Air-balloons </div>
            <br>

            <v-icon color="grey" size="x-large"> mdi-airballoon </v-icon>
          </v-card-text>
          <v-card-actions class="justify-center ">
            <v-btn variant="outlined" rounded @click="login()" size="small">
              Join
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-dialog>
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
