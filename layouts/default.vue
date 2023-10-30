<template>
  <v-app>
    <v-app-bar color="transparent" scroll-behavior="hide" flat>

      <v-spacer />
      <v-btn v-show="!unloged" rounded>
        <v-icon color="grey"> mdi-account </v-icon>
        {{
          user.slice(0, 5) +
          "..." +
          user.slice(-3)
        }}
      </v-btn>
      <v-menu bottom min-width="200px" rounded offset-y>
        <template>
          <v-btn icon>
            <v-icon color="grey" class="pr-2"> mdi-airballoon </v-icon>
          </v-btn>
        </template>
        <v-card>
          <div class="mx-auto text-center">
            <v-avatar color="transparent">
              <v-icon> mdi-account-circle </v-icon>
            </v-avatar>
            <!--  <p class="text-caption mt-1" v-if="unloged">
                                {{
                                    $store.state.userInfo.address.slice(0, 5) +
                                    "..." +
                                    $store.state.userInfo.address.slice(-3)
                                }}
                            </p> -->
            <!-- <v-chip color="#bc1fdb" v-if="$store.state.userInfo">
                {{ $store.state.userInfo.pass.name }}
              </v-chip> -->
            <v-divider class="my-3"></v-divider>
            <v-btn depressed rounded text to="/myLands"> Lands </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn depressed rounded text to="/collectibles">
              Collectibles
            </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn depressed rounded text @click="logout"> Disconnect </v-btn>
          </div>

        </v-card>
      </v-menu>
      <v-spacer />
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
